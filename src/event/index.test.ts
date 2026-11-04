import { webcrypto } from 'crypto';
import { TextEncoder } from 'util';
import { browser } from '../browser-service';
import { scamReportService } from '../api/services';
import { STORAGE_KEYS } from '../common/constants/app-keys.const';
import { EWebStatus } from '../api/types';
import store from './store';

jest.mock('../browser-service', () => {
	const event = () => ({ addListener: jest.fn() });
	return {
		isMozilla: false,
		browser: {
			runtime: {
				id: 'extension-test',
				getURL: (path: string) => `chrome-extension://extension-test/${path}`,
				onConnect: event(),
				onInstalled: event(),
				onMessage: event(),
				setUninstallURL: jest.fn()
			},
			webNavigation: { onBeforeNavigate: event(), onCompleted: event() },
			action: { setIcon: jest.fn() },
			tabs: { update: jest.fn(), create: jest.fn(), query: jest.fn(), onActivated: event(), onUpdated: event() },
			storage: { local: { get: jest.fn(), set: jest.fn(), remove: jest.fn() } }
		}
	};
});
jest.mock('webext-redux', () => ({ wrapStore: jest.fn() }));
jest.mock('./store', () => ({
	__esModule: true,
	default: { dispatch: jest.fn(), getState: () => ({ source: { activeTab: '' } }) }
}));
jest.mock('../api/services', () => ({
	scamReportService: { checkScam: jest.fn() },
	storageService: jest.requireActual('../api/services/storage.service').storageService
}));

let values: Record<string, any>;
let background: typeof import('./index');
let beforeNavigate: (navigation: object) => Promise<void>;
let connects: Array<(port: any) => Promise<void>>;
let receiveRuntime: (message: object, sender: any, respond: jest.Mock) => boolean;
const sender = { id: 'extension-test', url: 'https://dashboard.test/', frameId: 0, tab: { id: 7 } };

beforeAll(() => {
	jest.useFakeTimers();
	Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
	Object.defineProperty(globalThis, 'TextEncoder', { value: TextEncoder, configurable: true });
	process.env.REACT_APP_WEB_URL = 'https://dashboard.test';
	process.env.REACT_APP_WEB_LOGIN = 'web-login';
	process.env.REACT_APP_WEB_LOGOUT = 'web-logout';
	process.env.REACT_APP_DANGER_AGREE = 'danger-agree';
	process.env.REACT_APP_BACKEND_URL = 'https://backend.test';
	background = require('./index');
	beforeNavigate = (browser.webNavigation.onBeforeNavigate.addListener as jest.Mock).mock.calls[0][0];
	connects = (browser.runtime.onConnect.addListener as jest.Mock).mock.calls.map(([callback]) => callback);
	receiveRuntime = (browser.runtime.onMessage.addListener as jest.Mock).mock.calls[0][0];
});

afterAll(() => jest.useRealTimers());

beforeEach(() => {
	values = {
		[STORAGE_KEYS.NIGHTHAWK_LIST]: { blacklist: { domain: ['phishing.example'] }, trustlist: { domain: [] } }
	};
	(browser.storage.local.get as jest.Mock).mockImplementation(async (keys: string | string[]) =>
		Object.fromEntries((Array.isArray(keys) ? keys : [keys]).map((key) => [key, values[key]]))
	);
	(browser.storage.local.set as jest.Mock).mockImplementation(async (data: object) => {
		Object.assign(values, data);
	});
	(browser.storage.local.remove as jest.Mock).mockImplementation(async (keys: string | string[]) => {
		(Array.isArray(keys) ? keys : [keys]).forEach((key) => delete values[key]);
	});
	(browser.tabs.update as jest.Mock).mockClear();
	(browser.action.setIcon as jest.Mock).mockClear();
	(scamReportService.checkScam as jest.Mock).mockReset().mockResolvedValue({ status: EWebStatus.DANGEROUS });
});

test.each([
	'https://phishing.example/?twitter',
	'https://phishing.example/#facebook',
	'https://youtube.attacker.example/',
	'https://user:pass@phishing.example/login'
])('navigation checks URL instead of trusting a platform substring: %s', async (url) => {
	await beforeNavigate({ url, tabId: 7, frameId: 0 });
	expect(scamReportService.checkScam).toHaveBeenCalledWith({ url });
	expect(browser.tabs.update).toHaveBeenCalledWith(7, { url: expect.stringContaining('warning.html?url=') });
});

test('poisoned persisted bypass entries do not suppress either warning path', async () => {
	values[STORAGE_KEYS.DANGER_AGREE_LIST] = [{}, null, 123];
	await beforeNavigate({ url: 'https://phishing.example/', tabId: 7, frameId: 0 });
	await background.handleFlaggedSites({} as any, 'https://phishing.example/', 7);
	expect(browser.tabs.update).toHaveBeenCalledTimes(2);
});

test('privileged port rejects attacker URL even when its query contains the dashboard hostname', async () => {
	const port = {
		name: 'danger-agree',
		sender: { ...sender, url: 'https://attacker.test/?dashboard.test' },
		onMessage: { addListener: jest.fn() }
	};
	for (const connect of connects) await connect(port);
	expect(port.onMessage.addListener).not.toHaveBeenCalled();
});

test('a logout queued after login cannot be undone by its delayed persistence', async () => {
	const port = { name: 'web-login', sender, onMessage: { addListener: jest.fn() } };
	for (const connect of connects) await connect(port);
	const login = port.onMessage.addListener.mock.calls[0][0]({ token: 'user-A', isGuest: false });
	const logout = Promise.all(connects.map((connect) => connect({ name: 'web-logout', sender })));
	await Promise.all([login, logout]);
	expect(values[STORAGE_KEYS.TOKEN]).toBeUndefined();
	expect(values[STORAGE_KEYS.GUEST_TOKEN]).toBeUndefined();
});

test('intentional guest login invalidates automatic requests before storage awaits', async () => {
	const port = { name: 'web-login', sender, onMessage: { addListener: jest.fn() } };
	for (const connect of connects) await connect(port);
	(store.dispatch as jest.Mock).mockClear();
	const pending = port.onMessage.addListener.mock.calls[0][0]({ token: 'new-guest', isGuest: true });
	expect(store.dispatch).toHaveBeenCalledWith({ type: 'auth/invalidateAuthRequests', payload: undefined });
	await pending;
	expect(values[STORAGE_KEYS.GUEST_TOKEN]).toBe('new-guest');
});

test('trusted dashboard port rejects malformed bypass payload and accepts a real URL', async () => {
	const port = { name: 'danger-agree', sender, onMessage: { addListener: jest.fn() } };
	for (const connect of connects) await connect(port);
	const receive = port.onMessage.addListener.mock.calls[0][0];
	await receive({ url: {} });
	expect(values[STORAGE_KEYS.DANGER_AGREE_LIST]).toBeUndefined();
	await receive({ url: 'https://phishing.example/' });
	// The storage write runs asynchronously from the port callback.
	await Promise.resolve();
	await Promise.resolve();
	expect(values[STORAGE_KEYS.DANGER_AGREE_LIST]).toEqual(['https://phishing.example/']);
});

test('only the extension warning page can approve a bypass through runtime messages', async () => {
	const receive = receiveRuntime;
	expect(receive({ action: 'setDangerUrl', url: 'https://phishing.example/' }, sender, jest.fn())).toBe(false);
	const response = jest.fn();
	expect(
		receive(
			{ action: 'setDangerUrl', url: 'https://phishing.example/' },
			{ ...sender, url: 'chrome-extension://extension-test/warning.html?url=x' },
			response
		)
	).toBe(true);
	await Promise.resolve();
	await Promise.resolve();
	expect(values[STORAGE_KEYS.DANGER_AGREE_LIST]).toEqual(['https://phishing.example/']);
});

test('an old-account list response is discarded after the current token changes', async () => {
	values[STORAGE_KEYS.TOKEN] = 'A-token';
	let finish!: (value: object) => void;
	const response = new Promise((resolve) => {
		finish = resolve;
	});
	globalThis.fetch = jest.fn().mockReturnValue(response);
	const loading = background.loadLists();
	for (let i = 0; i < 8; i++) await Promise.resolve();
	expect(fetch).toHaveBeenCalledTimes(1);
	values[STORAGE_KEYS.TOKEN] = 'B-token';
	finish({ ok: true, json: async () => [{ url: 'https://A-private.example/' }] });
	expect((await loading).trustedList).toBeUndefined();
	expect(values[STORAGE_KEYS.TRUSTED_LIST]).toBeUndefined();
});

import { webcrypto } from 'crypto';
import { TextEncoder } from 'util';
import { browser } from '../../browser-service';
import { STORAGE_KEYS } from '../../common/constants/app-keys.const';
import { StorageService } from './storage.service';
import { EType } from '../types';
import { ITrustedList } from '../../popup/pages/trusted-list-page/trusted-list.types';

jest.mock('../../browser-service', () => ({
	browser: { storage: { local: { get: jest.fn(), set: jest.fn(), remove: jest.fn() } } }
}));

let values: Record<string, any>;
let service: StorageService;
const list = [{ id: 'A', url: 'https://a.example/', type: EType.WEBSITE }] as ITrustedList[];

beforeAll(() => {
	Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
	Object.defineProperty(globalThis, 'TextEncoder', { value: TextEncoder, configurable: true });
});

beforeEach(() => {
	values = {};
	service = new StorageService();
	(browser.storage.local.get as jest.Mock).mockImplementation(async (keys: string | string[]) =>
		Object.fromEntries((Array.isArray(keys) ? keys : [keys]).map((key) => [key, values[key]]))
	);
	(browser.storage.local.set as jest.Mock).mockImplementation(async (data: Record<string, unknown>) => {
		Object.assign(values, data);
	});
	(browser.storage.local.remove as jest.Mock).mockImplementation(async (keys: string | string[]) => {
		(Array.isArray(keys) ? keys : [keys]).forEach((key) => delete values[key]);
	});
});

test.each([{}, null, 'not-an-array', [null, {}, 123, 'javascript:alert(1)']])(
	'corrupt bypass storage cannot interrupt protection: %p',
	async (raw) => {
		values[STORAGE_KEYS.DANGER_AGREE_LIST] = raw;
		await expect(service.isDangerUrlAgreed('https://phishing.example/')).resolves.toBe(false);
	}
);

test('bypass agreement matches only the approved full URL', async () => {
	await service.setDangerAgreeListToStorage('https://phishing.example/login?next=1');
	await expect(service.isDangerUrlAgreed('https://phishing.example/login?next=1')).resolves.toBe(true);
	await expect(service.isDangerUrlAgreed('https://phishing.example/')).resolves.toBe(false);
	await expect(service.isDangerUrlAgreed('https://phishing.example/login?next=2')).resolves.toBe(false);
	await service.setDangerAgreeListToStorage({});
	expect(await service.getDangerAgreeListFromStorage()).toHaveLength(1);
});

test('legacy unowned personal caches are discarded and valid caches belong to one account', async () => {
	values[STORAGE_KEYS.TOKEN] = 'account-A-token';
	values[STORAGE_KEYS.TRUSTED_LIST] = list;
	expect(await service.getTrustedListFromStorage()).toBeUndefined();
	await service.setTokenToStorage('account-A-token');
	await service.setTrustedListToStorage(list, 'account-A-token');
	expect(await service.getTrustedListFromStorage()).toEqual(list);
	expect(JSON.stringify(values[STORAGE_KEYS.TRUSTED_LIST])).not.toContain('account-A-token');
	await service.setTokenToStorage('account-B-token');
	expect(await service.getTrustedListFromStorage()).toBeUndefined();
});

test('personal cache reads work in an insecure content world without crypto.subtle', async () => {
	await service.setTokenToStorage('account-A-token');
	await service.setTrustedListToStorage(list, 'account-A-token');
	Object.defineProperty(globalThis, 'crypto', { value: {}, configurable: true });
	try {
		expect(await service.getTrustedListFromStorage()).toEqual(list);
	} finally {
		Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
	}
});

test('a delayed old-account response cannot populate the next account cache', async () => {
	await service.setTokenToStorage('account-A-token');
	await service.setTokenToStorage('account-B-token');
	await service.setTrustedListToStorage(list, 'account-A-token');
	expect(await service.getTrustedListFromStorage()).toBeUndefined();
	expect(values[STORAGE_KEYS.TRUSTED_LIST]).toBeUndefined();
});

test('a delayed guest response cannot erase a signed-in user, and logout clears the cache', async () => {
	await service.setTokenToStorage('account-A-token');
	await service.setTrustedListToStorage(list, 'account-A-token');
	await service.setGuestTokenToStorage('guest-token');
	expect(await service.getTokenFromStorage()).toBe('account-A-token');
	expect(await service.getTrustedListFromStorage()).toEqual(list);
	await service.removeTokensFromStorage();
	expect(await service.getTokenFromStorage()).toBeUndefined();
	expect(await service.getTrustedListFromStorage()).toBeUndefined();
	await service.setGuestTokenToStorage('guest-token');
	expect(await service.getGuestTokenFromStorage()).toBe('guest-token');
	await service.removeTokensFromStorage();
	expect(await service.getGuestTokenFromStorage()).toBeUndefined();
});

test('cleanup of an invalid guest write cannot erase a queued newer guest', async () => {
	let current = true;
	(browser.storage.local.set as jest.Mock).mockImplementationOnce(async (data: object) => {
		Object.assign(values, data);
		current = false;
	});
	const stale = service.setGuestTokenToStorage('old-guest', () => current);
	const newer = service.setGuestTokenToStorage('new-guest');
	expect(await stale).toBe(false);
	expect(await newer).toBe(true);
	expect(await service.getGuestTokenFromStorage()).toBe('new-guest');
});

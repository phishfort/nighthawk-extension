import { browser } from '../browser-service';
import { isTrustedDashboardMessage } from '../common/utils/extension-origin.util';
import { messageManagerHandler } from './message-manager.component';

jest.mock('../browser-service', () => ({ browser: { runtime: { connect: jest.fn() } } }));
jest.mock('../common/utils/extension-origin.util', () => ({
	...jest.requireActual('../common/utils/extension-origin.util'),
	isTrustedDashboardMessage: jest.fn()
}));

const connect = browser.runtime.connect as jest.Mock;
const trustedMessage = isTrustedDashboardMessage as jest.Mock;
const postMessage = jest.fn();
const event = (data: unknown) => ({ data } as MessageEvent);

beforeEach(() => {
	jest.clearAllMocks();
	process.env.REACT_APP_DANGER_AGREE = 'danger-agree';
	process.env.REACT_APP_TRUSTED_LIST_WEB = 'trusted-list';
	trustedMessage.mockReturnValue(true);
	connect.mockReturnValue({ postMessage });
});

it('forwards a valid danger agreement only after the dashboard boundary passes', () => {
	messageManagerHandler(event({ type: 'danger-agree', url: 'https://danger.test/login' }));
	expect(connect).toHaveBeenCalledWith({ name: 'danger-agree' });
	expect(postMessage).toHaveBeenCalledWith({ url: 'https://danger.test/login' });
	trustedMessage.mockReturnValue(false);
	messageManagerHandler(event({ type: 'danger-agree', url: 'https://attacker.test' }));
	expect(connect).toHaveBeenCalledTimes(1);
});

it.each([
	null,
	undefined,
	[],
	{},
	{ type: 'danger-agree', url: {} },
	{ type: 'danger-agree', url: null },
	{ type: 'danger-agree', url: 'javascript:alert(1)' },
	{ type: 'trusted-list', shouldUpdateCache: 'true' }
])('ignores malformed messages without throwing: %j', (data) => {
	expect(() => messageManagerHandler(event(data))).not.toThrow();
	expect(connect).not.toHaveBeenCalled();
});

it.each([true, false])('preserves a boolean trusted-list refresh flag: %s', (shouldUpdateCache) => {
	messageManagerHandler(event({ type: 'trusted-list', shouldUpdateCache }));
	expect(connect).toHaveBeenCalledWith({ name: 'trusted-list' });
	expect(postMessage).toHaveBeenCalledWith({ shouldUpdateCache });
});

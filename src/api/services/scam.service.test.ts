import { ECheckDataType, EType, EWebStatus } from '../types';
import { scamReportService } from './scam.service';
import { storageService } from './storage.service';
import { browser } from '../../browser-service';

jest.mock('./storage.service', () => ({
	storageService: {
		getNighthawkListFromStorage: jest.fn(),
		getTokenFromStorage: jest.fn(),
		getTrustedListFromStorage: jest.fn()
	}
}));
jest.mock('../../browser-service', () => ({ browser: { runtime: { sendMessage: jest.fn() } } }));
jest.mock('./http-factory.service', () => ({
	HttpFactoryService: jest.fn().mockImplementation(() => ({ createAuthHttpService: jest.fn(), createHttpService: jest.fn() }))
}));
jest.mock('../../rule-engine', () => jest.fn());

const nighthawkStorage = storageService.getNighthawkListFromStorage as jest.Mock;
const tokenStorage = storageService.getTokenFromStorage as jest.Mock;
const trustedStorage = storageService.getTrustedListFromStorage as jest.Mock;
const loadListsMessage = browser.runtime.sendMessage as jest.Mock;

beforeEach(() => {
	jest.clearAllMocks();
	loadListsMessage.mockReset();
	loadListsMessage.mockImplementation((_message, callback) => callback(undefined));
	nighthawkStorage.mockResolvedValue({ blacklist: {}, trustlist: {} });
	tokenStorage.mockResolvedValue(undefined);
	trustedStorage.mockResolvedValue([]);
});

test.each([
	'https://phishing.example/login?continue=twitter#facebook',
	'https://www.phishing.example/checkout',
	'https://PHISHING.EXAMPLE/account',
	'https://user:pass@phishing.example/login',
	'https://twitter.com:facebook.com@phishing.example/login'
])('blocks blacklisted domains on full navigation URLs: %s', async (url) => {
	nighthawkStorage.mockResolvedValue({ blacklist: { domain: ['phishing.example'] }, trustlist: {} });
	await expect(scamReportService.checkScam({ url })).resolves.toEqual({ status: EWebStatus.DANGEROUS });
});

test('checks Google result URLs against domain lists', async () => {
	nighthawkStorage.mockResolvedValue({ blacklist: { domain: ['phishing.example'] }, trustlist: {} });
	await expect(scamReportService.checkScam({ url: 'https://phishing.example/login', type: ECheckDataType.GOOGLE })).resolves.toEqual({ status: EWebStatus.DANGEROUS });
});

test('returns unknown for platform roots and URL text without a matching list entry', async () => {
	for (const url of ['https://twitter.com/', 'https://facebook.com/', 'https://x.com/', 'https://attacker.example/?next=twitter#facebook']) {
		await expect(scamReportService.checkScam({ url })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
	}
});

test('matches the correct platform and preserves distinct Twitter and X namespaces', async () => {
	nighthawkStorage.mockResolvedValue({ blacklist: { twitter: ['alice'] }, trustlist: {} });
	await expect(scamReportService.checkScam({ url: 'https://twitter.com/Alice/status/123' })).resolves.toEqual({ status: EWebStatus.DANGEROUS });
	await expect(scamReportService.checkScam({ url: 'alice', type: ECheckDataType.TWITTER })).resolves.toEqual({ status: EWebStatus.DANGEROUS });
	for (const url of ['https://facebook.com/alice', 'https://x.com/alice', 'https://attacker.example/alice?twitter']) {
		await expect(scamReportService.checkScam({ url })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
	}
	await expect(scamReportService.checkScam({ url: 'alice', type: ECheckDataType.X })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
});

test('maps the X check type exactly instead of choosing another key containing x', async () => {
	nighthawkStorage.mockResolvedValue({ blacklist: { x: ['alice'] }, trustlist: {} });
	await expect(scamReportService.checkScam({ url: 'alice', type: ECheckDataType.X })).resolves.toEqual({ status: EWebStatus.DANGEROUS });
});

test('uses exact hosts without implicit subdomain trust', async () => {
	nighthawkStorage.mockResolvedValue({ blacklist: {}, trustlist: { domain: ['trusted.example'] } });
	await expect(scamReportService.checkScam({ url: 'https://www.trusted.example/account' })).resolves.toEqual({ status: EWebStatus.SAFE });
	await expect(scamReportService.checkScam({ url: 'https://untrusted.trusted.example/account' })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
});

test('honors the platform type of the signed-in user trust list', async () => {
	tokenStorage.mockResolvedValue('signed-in');
	trustedStorage.mockResolvedValue([{ type: EType.FACEBOOK, url: 'alice' }]);
	await expect(scamReportService.checkScam({ url: 'https://facebook.com/alice' })).resolves.toEqual({ status: EWebStatus.SAFE });
	await expect(scamReportService.checkScam({ url: 'https://twitter.com/alice' })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
	await expect(scamReportService.checkScam({ url: 'alice', type: ECheckDataType.TWITTER })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
});

test('keeps a blacklist match ahead of global and personal trust', async () => {
	nighthawkStorage.mockResolvedValue({ blacklist: { domain: ['phishing.example'] }, trustlist: { domain: ['phishing.example'] } });
	tokenStorage.mockResolvedValue('signed-in');
	trustedStorage.mockResolvedValue([{ type: EType.WEBSITE, url: 'phishing.example' }]);
	await expect(scamReportService.checkScam({ url: 'https://phishing.example/login' })).resolves.toEqual({ status: EWebStatus.DANGEROUS });
});

test('handles absent list sections without declaring safety', async () => {
	nighthawkStorage.mockResolvedValue({});
	await expect(scamReportService.checkScam({ url: 'https://attacker.example' })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
});


test('uses an asynchronously loaded blacklist in the same cold-cache check', async () => {
	nighthawkStorage.mockResolvedValue(undefined);
	loadListsMessage.mockImplementation((_message, callback) => {
		Promise.resolve().then(() => callback({ nighthawkList: { blacklist: { domain: ['phishing.example'] }, trustlist: {} } }));
	});
	await expect(scamReportService.checkScam({ url: 'https://phishing.example/login' })).resolves.toEqual({ status: EWebStatus.DANGEROUS });
	expect(loadListsMessage).toHaveBeenCalledTimes(1);
});

test('uses a freshly loaded personal list when the owned cache was absent or discarded', async () => {
	tokenStorage.mockResolvedValue('same-session');
	trustedStorage.mockResolvedValue(undefined);
	loadListsMessage.mockImplementation((_message, callback) => {
		Promise.resolve().then(() => callback({ trustedList: [{ type: EType.WEBSITE, url: 'trusted.example' }] }));
	});
	await expect(scamReportService.checkScam({ url: 'https://trusted.example/account' })).resolves.toEqual({ status: EWebStatus.SAFE });
	expect(loadListsMessage).toHaveBeenCalledTimes(1);
});

test('loads both missing caches once and keeps returned blacklist precedence', async () => {
	nighthawkStorage.mockResolvedValue(undefined);
	tokenStorage.mockResolvedValue('same-session');
	trustedStorage.mockResolvedValue(undefined);
	loadListsMessage.mockImplementation((_message, callback) => callback({
		nighthawkList: { blacklist: { domain: ['phishing.example'] }, trustlist: {} },
		trustedList: [{ type: EType.WEBSITE, url: 'phishing.example' }]
	}));
	await expect(scamReportService.checkScam({ url: 'https://phishing.example/login' })).resolves.toEqual({ status: EWebStatus.DANGEROUS });
	expect(loadListsMessage).toHaveBeenCalledTimes(1);
});

test.each(['new-session', undefined])('discards a loaded personal list after the auth token changes to %s', async (newToken) => {
	tokenStorage.mockResolvedValueOnce('old-session').mockResolvedValue(newToken);
	trustedStorage.mockResolvedValue(undefined);
	loadListsMessage.mockImplementation((_message, callback) => {
		Promise.resolve().then(() => callback({ trustedList: [{ type: EType.WEBSITE, url: 'trusted.example' }] }));
	});
	await expect(scamReportService.checkScam({ url: 'https://trusted.example/account' })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
});

test('discards a cached personal list if the token changes during its read', async () => {
	tokenStorage.mockResolvedValueOnce('old-session').mockResolvedValue('new-session');
	trustedStorage.mockResolvedValue([{ type: EType.WEBSITE, url: 'trusted.example' }]);
	await expect(scamReportService.checkScam({ url: 'https://trusted.example/account' })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
	expect(loadListsMessage).not.toHaveBeenCalled();
});

test('does not declare safety when the list request returns no data or throws', async () => {
	nighthawkStorage.mockResolvedValue(undefined);
	await expect(scamReportService.checkScam({ url: 'https://attacker.example' })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
	loadListsMessage.mockImplementation(() => { throw new Error('channel unavailable'); });
	await expect(scamReportService.checkScam({ url: 'https://attacker.example' })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
});

test('checks raw YouTube channel and video identifiers without folding case', async () => {
	nighthawkStorage.mockResolvedValue({ blacklist: {}, trustlist: { youtube: ['UCabc', 'VideoId'] } });
	for (const url of ['UCabc', 'VideoId']) {
		await expect(scamReportService.checkScam({ url, type: ECheckDataType.YOUTUBE })).resolves.toEqual({ status: EWebStatus.SAFE });
	}
	for (const url of ['UCABC', 'videoid']) {
		await expect(scamReportService.checkScam({ url, type: ECheckDataType.YOUTUBE })).resolves.toEqual({ status: EWebStatus.UNKNOWN });
	}
});

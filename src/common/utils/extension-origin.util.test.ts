import {
	getDashboardOrigin,
	getGuardianPoints,
	isDashboardUrl,
	isExtensionPageUrl,
	isGuardianPoints,
	isHttpUrlString,
	isPlainRecord,
	isTrustedDashboardMessage,
	isValidToken
} from './extension-origin.util';

const dashboardOrigin = 'https://dashboard.test';

describe('dashboard origin boundary', () => {
	const originalConfiguredUrl = process.env.REACT_APP_WEB_URL;
	beforeEach(() => {
		process.env.REACT_APP_WEB_URL = dashboardOrigin;
	});
	afterAll(() => {
		if (originalConfiguredUrl === undefined) delete process.env.REACT_APP_WEB_URL;
		else process.env.REACT_APP_WEB_URL = originalConfiguredUrl;
	});

	it('normalizes a secure configured URL and matches its exact origin', () => {
		expect(getDashboardOrigin('https://dashboard.test:443/base')).toBe(dashboardOrigin);
		expect(isDashboardUrl(`${dashboardOrigin}/login?next=/profile`)).toBe(true);
	});

	it.each([
		'http://dashboard.test/login',
		'https://attacker.test/?dashboard.test',
		'https://attacker.test/dashboard.test',
		'https://dashboard.test.attacker.test/',
		'https://dashboard.test:444/',
		'https://user@dashboard.test/',
		'about:blank',
		null
	])('rejects a document outside the exact secure origin: %s', (url) => {
		expect(isDashboardUrl(url)).toBe(false);
	});

	it.each([
		undefined,
		'',
		'invalid',
		'http://dashboard.test',
		'http://localhost:3000',
		'https://user:pass@dashboard.test'
	])('fails closed for an invalid or insecure configuration: %s', (configuredUrl) => {
		if (configuredUrl === undefined) delete process.env.REACT_APP_WEB_URL;
		else process.env.REACT_APP_WEB_URL = configuredUrl;
		expect(getDashboardOrigin()).toBeNull();
		expect(isDashboardUrl(`${dashboardOrigin}/`)).toBe(false);
	});

	it('accepts only trusted same-window events on the actual dashboard document', () => {
		const currentWindow = { location: { href: `${dashboardOrigin}/login` } } as Window;
		const event = { isTrusted: true, source: currentWindow, origin: dashboardOrigin } as MessageEvent;
		expect(isTrustedDashboardMessage(event, currentWindow)).toBe(true);
		expect(isTrustedDashboardMessage({ ...event, isTrusted: false } as MessageEvent, currentWindow)).toBe(false);
		expect(isTrustedDashboardMessage({ ...event, source: null } as MessageEvent, currentWindow)).toBe(false);
		expect(
			isTrustedDashboardMessage({ ...event, origin: 'https://attacker.test' } as MessageEvent, currentWindow)
		).toBe(false);
		currentWindow.location.href = `https://attacker.test/?${dashboardOrigin}`;
		expect(isTrustedDashboardMessage(event, currentWindow)).toBe(false);
		currentWindow.location.href = 'http://dashboard.test/login';
		expect(isTrustedDashboardMessage(event, currentWindow)).toBe(false);
	});

	it('rejects a browser-created synthetic MessageEvent', () => {
		const event = new MessageEvent('message', { source: window, origin: dashboardOrigin, data: { type: 'login' } });
		expect(event.isTrusted).toBe(false);
		expect(isTrustedDashboardMessage(event)).toBe(false);
	});
});

describe('extension page identity', () => {
	it.each(['chrome-extension:', 'moz-extension:'])('compares the full identity and path of %s pages', (protocol) => {
		const expected = `${protocol}//extension-id/warning.html`;
		expect(isExtensionPageUrl(`${expected}?url=https://danger.test/#warning`, expected)).toBe(true);
		expect(isExtensionPageUrl(`${protocol}//attacker-id/warning.html`, expected)).toBe(false);
		expect(isExtensionPageUrl(`${protocol}//extension-id/index.html`, expected)).toBe(false);
		expect(isExtensionPageUrl('https://extension-id/warning.html', expected)).toBe(false);
		expect(isExtensionPageUrl('about:blank', expected)).toBe(false);
		expect(isExtensionPageUrl(null, expected)).toBe(false);
	});

	it('does not accept an ordinary web URL as an extension identity', () => {
		expect(isExtensionPageUrl('https://dashboard.test/warning.html', 'https://dashboard.test/warning.html')).toBe(
			false
		);
	});
});

describe('dashboard payload guards', () => {
	it('rejects non-record messages', () => {
		for (const data of [null, undefined, [], 'message', 1, new Date()]) expect(isPlainRecord(data)).toBe(false);
		expect(isPlainRecord({ type: 'login' })).toBe(true);
	});

	it('accepts token strings without whitespace', () => {
		expect(isValidToken('dummy.jwt.token')).toBe(true);
		for (const token of ['', ' token', 'token\n', {}, null]) expect(isValidToken(token)).toBe(false);
	});

	it('accepts only absolute HTTP(S) URL strings', () => {
		for (const url of ['https://danger.test/path?query#fragment', 'http://danger.test/'])
			expect(isHttpUrlString(url)).toBe(true);
		for (const url of [
			{},
			null,
			'',
			'/relative',
			'javascript:alert(1)',
			' https://danger.test',
			'https://user:pass@danger.test'
		]) {
			expect(isHttpUrlString(url)).toBe(false);
		}
	});

	it('canonicalizes nonnegative decimal points and rejects coercion tricks', () => {
		for (const value of [0, 42, 1.5, '0', '42', '1.50']) {
			expect(getGuardianPoints(value)).toBe(Number(value));
			expect(isGuardianPoints(value)).toBe(true);
		}
		for (const value of [null, undefined, {}, [], true, -1, Infinity, NaN, '', ' ', '0x10', '1e2', '-1', '.5', '5.']) {
			expect(getGuardianPoints(value)).toBeNull();
			expect(isGuardianPoints(value)).toBe(false);
		}
	});
});

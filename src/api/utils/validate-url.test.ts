/* eslint-disable no-script-url -- Regression cases intentionally include rejected script schemes. */
import { EType } from '../types';
import { getUrlPlatform, getValidUrl, getWebsiteHostname, matchesListEntry, parseWebUrl } from './validate-url';

describe('URL classification and canonicalization', () => {
	test.each([
		'https://attacker.example/?twitter',
		'https://attacker.example/#facebook',
		'https://attacker.example/linkedin/youtube?next=x.com',
		'https://twitter.com.attacker.example/alice',
		'https://twitter.com@attacker.example/alice',
		'https://twitter.com:facebook.com@attacker.example/alice',
		'https://m.facebook.com/alice',
		'https://notx.com/alice',
		'javascript:twitter.com',
		'not a URL'
	])('does not classify attacker-controlled URL text as a platform: %s', (url) => {
		expect(getUrlPlatform(url)).toBe(EType.WEBSITE);
	});

	test.each<[string, EType]>([
		['https://www.facebook.com/Alice', EType.FACEBOOK],
		['https://twitter.com/Alice/status/123', EType.TWITTER],
		['https://WWW.YOUTUBE.COM/@Alice', EType.YOUTUBE],
		['linkedin.com/in/Alice', EType.LINKEDIN],
		['https://x.com/Alice', EType.X],
		['https://user:pass@twitter.com/Alice', EType.TWITTER]
	])('classifies the exact platform hostname: %s', (url, type) => {
		expect(getUrlPlatform(url)).toBe(type);
	});

	test.each<[string, string]>([
		['https://WWW.Phishing.Example/login?next=twitter#facebook', 'phishing.example'],
		['phishing.example/login', 'phishing.example'],
		['https://user:pass@phishing.example/login', 'phishing.example'],
		['https://www.facebook.com/profile.php?id=12345&ref=feed', '12345'],
		['https://facebook.com/groups/bad-group/posts/99', 'bad-group'],
		['https://facebook.com/people/Name/12345678901234', '12345678901234'],
		['https://www.youtube.com/@BadChannel/videos', 'BadChannel'],
		['https://youtube.com/channel/UCabc123/videos', 'UCabc123'],
		['https://youtube.com/watch?v=VideoId&t=20', 'VideoId'],
		['https://twitter.com/BadUser/status/123', 'BadUser'],
		['https://x.com/BadUser/status/123', 'BadUser'],
		['https://linkedin.com/in/bad-user/details', 'bad-user']
	])('normalizes the applicable website or account identity: %s', (url, expected) => {
		expect(getValidUrl(url)).toBe(expected);
	});

	test.each(['', 'not a URL', 'javascript:alert(1)', 'data:text/plain,example.com', 'https://[bad', 'https://example.com\\@attacker.example'])('rejects invalid and unsupported input: %s', (url) => {
		expect(parseWebUrl(url)).toBeUndefined();
		expect(getValidUrl(url)).toBe('');
	});

	test('parses credentials while keeping reputation scoped to the visited host', () => {
		const url = parseWebUrl('https://user:pass@phishing.example/login');
		expect(url?.hostname).toBe('phishing.example');
		expect(getWebsiteHostname(url?.href || '')).toBe('phishing.example');
	});

	test('uses the actual hostname when userinfo or social-looking URL text is present', () => {
		expect(getValidUrl('https://twitter.com@attacker.example/facebook?id=123')).toBe('attacker.example');
		expect(getWebsiteHostname('https://attacker.example/?next=facebook.com')).toBe('attacker.example');
	});
});

describe('typed reputation-list matching', () => {
	test.each([
		'https://phishing.example',
		'https://phishing.example/login',
		'https://user:pass@phishing.example/login',
		'https://twitter.com:facebook.com@phishing.example/login',
		'https://PHISHING.EXAMPLE/login?next=twitter#facebook',
		'https://www.phishing.example/path',
		'phishing.example/checkout'
	])('matches a listed website across paths and URL decorations: %s', (url) => {
		expect(matchesListEntry('phishing.example', EType.WEBSITE, url)).toBe(true);
	});

	test.each(['https://sub.phishing.example', 'https://phishing.example.attacker.example', 'https://other.example/?phishing.example'])('keeps website matching confined to the exact host and www alias: %s', (url) => {
		expect(matchesListEntry('phishing.example', EType.WEBSITE, url)).toBe(false);
	});

	test.each<[EType, string, string]>([
		[EType.FACEBOOK, 'alice', 'https://www.facebook.com/Alice/posts/123'],
		[EType.FACEBOOK, '12345', 'https://facebook.com/profile.php?id=12345'],
		[EType.TWITTER, 'alice', 'https://twitter.com/Alice/status/123'],
		[EType.X, 'alice', 'https://x.com/Alice/status/123'],
		[EType.LINKEDIN, 'alice', 'https://www.linkedin.com/in/Alice'],
		[EType.YOUTUBE, 'alice', 'https://www.youtube.com/@Alice'],
		[EType.YOUTUBE, 'UCabc', 'https://www.youtube.com/channel/UCabc'],
		[EType.YOUTUBE, 'VideoId', 'https://www.youtube.com/watch?v=VideoId']
	])('supports canonical URLs and typed raw account identifiers for %s', (type, entry, url) => {
		expect(matchesListEntry(entry, type, url)).toBe(true);
		expect(matchesListEntry(url, type, entry, type)).toBe(true);
	});

	test('does not apply raw or full-URL social identities across platforms', () => {
		expect(matchesListEntry('alice', EType.TWITTER, 'https://facebook.com/alice')).toBe(false);
		expect(matchesListEntry('alice', EType.TWITTER, 'alice', EType.FACEBOOK)).toBe(false);
		expect(matchesListEntry('https://facebook.com/alice', EType.TWITTER, 'alice', EType.TWITTER)).toBe(false);
		expect(matchesListEntry('https://twitter.com/alice', EType.X, 'https://x.com/alice')).toBe(false);
		expect(matchesListEntry('alice', EType.TWITTER, 'alice')).toBe(false);
		expect(matchesListEntry('alice', EType.WEBSITE, 'alice', EType.TWITTER)).toBe(false);
	});

	test('does not turn social platform roots into account identities', () => {
		expect(matchesListEntry('twitter.com', EType.TWITTER, 'https://twitter.com/')).toBe(false);
		expect(matchesListEntry('facebook.com', EType.FACEBOOK, 'facebook.com', EType.FACEBOOK)).toBe(false);
	});

	test.each(['UCabc', 'VideoId'])('keeps raw YouTube IDs exact after content extraction: %s', (identifier) => {
		expect(matchesListEntry(identifier, EType.YOUTUBE, identifier, EType.YOUTUBE)).toBe(true);
		expect(matchesListEntry(identifier, EType.YOUTUBE, identifier.toUpperCase(), EType.YOUTUBE)).toBe(false);
		expect(matchesListEntry(identifier, EType.YOUTUBE, identifier.toLowerCase(), EType.YOUTUBE)).toBe(false);
	});

	test('compares explicitly identified YouTube handles without case sensitivity', () => {
		expect(matchesListEntry('https://youtube.com/@Alice', EType.YOUTUBE, 'https://youtube.com/@ALICE')).toBe(true);
		expect(matchesListEntry('@Alice', EType.YOUTUBE, '@ALICE', EType.YOUTUBE)).toBe(true);
	});

	test('keeps YouTube video and channel IDs case-sensitive', () => {
		expect(matchesListEntry('UCabc', EType.YOUTUBE, 'https://youtube.com/channel/UCABC')).toBe(false);
		expect(matchesListEntry('VideoId', EType.YOUTUBE, 'https://youtube.com/watch?v=videoid')).toBe(false);
	});
});

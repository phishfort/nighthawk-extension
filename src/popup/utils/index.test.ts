/* eslint-disable no-script-url -- Regression cases intentionally include rejected script schemes. */
import { EType } from '../../api/types';
import { getUrlType, getValidUrl, handleFormType } from './index';

jest.mock('../../browser-service', () => ({ browser: {} }));
jest.mock('../components/navigator/routes.utils', () => ({ ROUTES: {} }));
jest.mock('../../content/utils/index.util', () => ({ removeWWW: (value: string) => value.replace(/^www\./, '') }));

test('popup classification uses the actual hostname', () => {
	expect(getUrlType('https://attacker.example/?twitter#facebook')).toBe(EType.WEBSITE);
	expect(getUrlType('https://facebook.com.attacker.example/alice')).toBe(EType.WEBSITE);
	expect(getUrlType('https://twitter.com@attacker.example/alice')).toBe(EType.WEBSITE);
	expect(getUrlType('https://www.twitter.com/alice')).toBe(EType.TWITTER);
	expect(getUrlType('https://x.com/alice')).toBe(EType.X);
});

test('form selection ignores social-looking substrings and selects exact platform hosts', () => {
	const setType = jest.fn();
	handleFormType(EType.TWITTER, 'https://attacker.example/?twitter', setType);
	expect(setType).toHaveBeenLastCalledWith(expect.objectContaining({ value: EType.WEBSITE }));
	handleFormType(EType.WEBSITE, 'https://www.facebook.com/alice', setType);
	expect(setType).toHaveBeenLastCalledWith(expect.objectContaining({ value: EType.FACEBOOK }));
});

test.each<[string, string]>([
	['https://www.example.com/login?twitter', 'example.com'],
	['https://xylophone.example/path', 'xylophone.example'],
	['https://twitter.com.attacker.example/alice', 'twitter.com.attacker.example'],
	['https://x.com/Alice/status/123', 'x.com/Alice'],
	['https://www.linkedin.com/in/Alice/details', 'linkedin.com/in/Alice'],
	['https://www.youtube.com/channel/UCabc/videos', 'youtube.com/channel/UCabc'],
	['https://youtube.com/watch?v=VideoId&t=30', 'youtube.com/watch?v=VideoId'],
	['https://facebook.com/profile.php?id=12345&ref=feed', 'facebook.com/profile.php?id=12345']
])('displays a canonical URL without losing platform identity: %s', (url, expected) => {
	expect(getValidUrl(url, true)).toBe(expected);
	expect(getValidUrl(url)).toBe(`www.${expected}`);
});

test('invalid display URLs return an empty string', () => {
	expect(getValidUrl('not a URL')).toBe('');
	expect(getValidUrl('javascript:twitter.com')).toBe('');
});

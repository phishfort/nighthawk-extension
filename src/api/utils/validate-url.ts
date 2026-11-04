import { EType } from '../types';

const SOCIAL_HOST_TYPES = new Map<string, EType>([
	['facebook.com', EType.FACEBOOK],
	['www.facebook.com', EType.FACEBOOK],
	['twitter.com', EType.TWITTER],
	['www.twitter.com', EType.TWITTER],
	['x.com', EType.X],
	['www.x.com', EType.X],
	['youtube.com', EType.YOUTUBE],
	['www.youtube.com', EType.YOUTUBE],
	['linkedin.com', EType.LINKEDIN],
	['www.linkedin.com', EType.LINKEDIN]
]);

export function parseWebUrl(value: string): URL | undefined {
	if (typeof value !== 'string') return undefined;
	const input = value.trim();
	// Reject alternate URL syntax that could change which text becomes the host.
	if (!input || input.includes('\\') || Array.from(input).some((character) => character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127)) return undefined;
	const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(input);
	if (hasScheme && !/^https?:\/\//i.test(input)) return undefined;

	try {
		const url = new URL(hasScheme ? input : input.startsWith('//') ? `https:${input}` : `https://${input}`);
		if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) return undefined;
		return url;
	} catch (error) {
		return undefined;
	}
}

export function getUrlPlatform(value: string): EType {
	const url = parseWebUrl(value);
	// Only these exact platform hosts qualify; URL paths and suffix hosts do not.
	return url ? SOCIAL_HOST_TYPES.get(url.hostname.toLowerCase().replace(/\.$/, '')) || EType.WEBSITE : EType.WEBSITE;
}

export function getWebsiteHostname(value: string): string {
	const url = parseWebUrl(value);
	// Lists use exact hosts, with the existing www alias. Subdomains are independent.
	return url ? url.hostname.toLowerCase().replace(/\.$/, '').replace(/^www\./, '') : '';
}

function socialIdentifier(url: URL, type: EType): string {
	const parts = url.pathname.split('/').filter(Boolean);
	if (type === EType.FACEBOOK) {
		if (url.pathname === '/profile.php' && url.searchParams.get('id')) return url.searchParams.get('id') || '';
		const numericId = url.pathname.match(/\/(\d{14,})(?=\/|$)/);
		if (numericId) return numericId[1];
		const keywords = ['groups', 'pages', 'people', 'events', 'marketplace', 'media', 'set', 'p'];
		return parts.find((part) => !keywords.includes(part)) || '';
	}
	if (type === EType.TWITTER || type === EType.X) return parts[0] || '';
	if (type === EType.LINKEDIN) {
		return ['in', 'company', 'school', 'showcase'].includes(parts[0]) ? parts[1] || '' : '';
	}
	if (type === EType.YOUTUBE) {
		if (['channel', 'c', 'user'].includes(parts[0])) return parts[1] || '';
		if (parts[0]?.startsWith('@')) return parts[0].slice(1);
		if (url.pathname === '/watch') return url.searchParams.get('v') || '';
	}
	return '';
}

function getSocialIdentifier(value: string, type: EType, allowBareIdentifier: boolean): string {
	if (typeof value !== 'string') return '';
	const input = value.trim();
	const url = parseWebUrl(input);
	if (url && getUrlPlatform(input) === type) return socialIdentifier(url, type);
	// Existing content checks send account IDs without URLs. Only a typed request
	// can interpret those IDs, so another platform cannot inherit their reputation.
	if (allowBareIdentifier && /^@?[a-z\d_.-]+$/i.test(input) && !SOCIAL_HOST_TYPES.has(input.toLowerCase())) {
		return input.replace(/^@/, '');
	}
	return '';
}

export function matchesListEntry(entry: string, type: EType, candidate: string, candidateType?: EType): boolean {
	if (candidateType !== undefined && candidateType !== type) return false;
	if (type === EType.WEBSITE) {
		const expected = getWebsiteHostname(entry);
		return !!expected && expected === getWebsiteHostname(candidate);
	}
	if (![EType.FACEBOOK, EType.TWITTER, EType.X, EType.YOUTUBE, EType.LINKEDIN].includes(type)) return false;
	if (candidateType === undefined && getUrlPlatform(candidate) !== type) return false;
	const expected = getSocialIdentifier(entry, type, true);
	const actual = getSocialIdentifier(candidate, type, candidateType !== undefined);
	if (!expected || !actual) return false;

	// Raw content checks lose the URL kind. Keep IDs exact unless an explicit
	// handle identifies the comparison as case-insensitive.
	if (type === EType.YOUTUBE) {
		const hasHandle = [entry, candidate].some((value) => {
			const url = parseWebUrl(value);
			return value.trim().startsWith('@') || (getUrlPlatform(value) === EType.YOUTUBE && !!url?.pathname.startsWith('/@'));
		});
		return hasHandle ? expected.toLowerCase() === actual.toLowerCase() : expected === actual;
	}
	return expected.toLowerCase() === actual.toLowerCase();
}

export function getValidUrl(value: string): string {
	const url = parseWebUrl(value);
	if (!url) return '';
	const type = getUrlPlatform(value);
	return (type !== EType.WEBSITE && socialIdentifier(url, type)) || getWebsiteHostname(value);
}

export const CACHE_TIME = 30 * 60 * 1000; // 30 minutes
export const REFETCH_TIME = CACHE_TIME - 20 * 60 * 1000;

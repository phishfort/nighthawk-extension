import { Dispatch } from 'react';
import { browser } from '../../browser-service';
import { EType, EWebStatus } from '../../api/types';
import { ROUTES } from '../components/navigator/routes.utils';
import { FormSelectProps } from '../components/common/form-field-container/types';
import { HOST_KEYS } from '../../common/constants/app-keys.const';
import { getUrlPlatform, getWebsiteHostname, parseWebUrl } from '../../api/utils/validate-url';
import { removeWWW } from '../../content/utils/index.util';
import { pattern } from '../../common/utils/warning-url.util';
export { pattern } from '../../common/utils/warning-url.util';

export const handleRedirect = (url: string) => {
	browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		const currentUrl = tabs[0].url;
		if (currentUrl?.includes(HOST_KEYS.NIGHTHAWK_WEB_VERSION)) {
			browser.tabs.update({ url }).then(() => window.close());
		} else {
			browser.tabs.create({ url }).then(() => window.close());
		}
	});
};

export const getInitRoute = (activeTab: string, type: EWebStatus) => {
	if (pattern.test(activeTab)) {
		return ROUTES.DANGEROUS;
	}
	return !activeTab?.includes('http')
		? ROUTES.UNKNOWN
		: type === EWebStatus.DANGEROUS
			? ROUTES.DANGEROUS
			: type === EWebStatus.SAFE
				? ROUTES.VALID
				: ROUTES.UNKNOWN;
};

export const options: FormSelectProps[] = [
	{ value: EType.WEBSITE, label: 'Website' },
	{ value: EType.TWITTER, label: 'Twitter Account' },
	{ value: EType.FACEBOOK, label: 'Facebook Account, Page, or Group' },
	{ value: EType.YOUTUBE, label: 'Youtube Account' },
	{ value: EType.LINKEDIN, label: 'LinkedIn Account' },
	{ value: EType.X, label: 'X account' }
];

export const getNextOption = (type: EType) => {
	return options.find((el) => el.value === type);
};

export const handleFormType = (
	currentType: EType,
	url: string,
	setCurrentType: Dispatch<React.SetStateAction<FormSelectProps | null>>
) => {
	const type = getUrlType(url);
	if (type !== currentType && url.trim()) {
		const nextOption = getNextOption(type);
		if (nextOption) setCurrentType(nextOption);
	}
};

export const PLACEHOLDER_SCAM_MSG = {
	[EType.WEBSITE]: 'https://www.bad-website.com',
	[EType.YOUTUBE]: 'https://www.youtube.com/@bad-channel',
	[EType.FACEBOOK]: 'https://www.facebook.com/bad-user',
	[EType.LINKEDIN]: 'https://www.linkedin.com/in/bad-user',
	[EType.TWITTER]: 'https://twitter.com/bad-user',
	[EType.X]: 'https://x.com/bad-user'

};

export const handleScamPlaceholder = (currentType: EType) => {
	switch (currentType) {
		case EType.WEBSITE:
			return PLACEHOLDER_SCAM_MSG[EType.WEBSITE];
		case EType.YOUTUBE:
			return PLACEHOLDER_SCAM_MSG[EType.YOUTUBE];
		case EType.FACEBOOK:
			return PLACEHOLDER_SCAM_MSG[EType.FACEBOOK];
		case EType.LINKEDIN:
			return PLACEHOLDER_SCAM_MSG[EType.LINKEDIN];
		case EType.TWITTER:
			return PLACEHOLDER_SCAM_MSG[EType.TWITTER];
		case EType.X:
			return PLACEHOLDER_SCAM_MSG[EType.X];
		default:
			return PLACEHOLDER_SCAM_MSG[EType.WEBSITE];
	}
};

export const PLACEHOLDER_TRUST_MSG = {
	[EType.WEBSITE]: 'https://www.trust-website.com',
	[EType.YOUTUBE]: 'https://www.youtube.com/@trusted-channel',
	[EType.FACEBOOK]: 'https://www.facebook.com/trusted-user',
	[EType.LINKEDIN]: 'https://www.linkedin.com/in/trusted-user',
	[EType.TWITTER]: 'https://twitter.com/TrustedUser'
};

export const handleTrustPlaceholder = (currentType: EType) => {
	switch (currentType) {
		case EType.WEBSITE:
			return PLACEHOLDER_TRUST_MSG[EType.WEBSITE];
		case EType.YOUTUBE:
			return PLACEHOLDER_TRUST_MSG[EType.YOUTUBE];
		case EType.FACEBOOK:
			return PLACEHOLDER_TRUST_MSG[EType.FACEBOOK];
		case EType.LINKEDIN:
			return PLACEHOLDER_TRUST_MSG[EType.LINKEDIN];
		case EType.TWITTER:
			return PLACEHOLDER_TRUST_MSG[EType.TWITTER];
		default:
			return PLACEHOLDER_TRUST_MSG[EType.WEBSITE];
	}
};

export const validateUrl = (host: string, path: string, search = ''): string => {
	const url = parseWebUrl(`https://${host}${path}${search}`);
	if (!url) return '';
	const dns = getWebsiteHostname(url.href);
	const type = getUrlType(url.href);
	const parts = url.pathname.split('/').filter(Boolean);
	if (type === EType.FACEBOOK) {
		if (parts[0] === 'groups' && parts[1]) return `${dns}/groups/${parts[1]}`;
		if (url.pathname === '/profile.php' && url.searchParams.get('id')) {
			return `${dns}/profile.php?id=${encodeURIComponent(url.searchParams.get('id') || '')}`;
		}
		if (parts[0] === 'people' && parts[1] && parts[2]) return `${dns}/people/${parts[1]}/${parts[2]}`;
		return parts[0] ? `${dns}/${parts[0]}` : dns;
	}
	if (type === EType.TWITTER || type === EType.X) return parts[0] ? `${dns}/${parts[0]}` : dns;
	if (type === EType.LINKEDIN) return parts.length >= 2 ? `${dns}/${parts[0]}/${parts[1]}` : dns;
	if (type === EType.YOUTUBE) {
		if (url.pathname === '/watch' && url.searchParams.get('v')) {
			return `${dns}/watch?v=${encodeURIComponent(url.searchParams.get('v') || '')}`;
		}
		if (['channel', 'c', 'user'].includes(parts[0]) && parts[1]) return `${dns}/${parts[0]}/${parts[1]}`;
		if (parts[0]?.startsWith('@')) return `${dns}/${parts[0]}`;
	}
	return dns;
};

export const getValidUrl = (value: string, noWWW?: boolean) => {
	const url = parseWebUrl(value);
	if (!url) return '';
	const normalized = validateUrl(url.hostname, url.pathname, url.search);
	return noWWW ? normalized : `www.${normalized}`;
};

export const getUrlType = (url: string): EType => getUrlPlatform(url);

export const checkUrl = (url: string): string => {
	try {
		const host = removeWWW(new URL(url).host);
		if (host && host !== 'newtab') {
			return url ? 'www.' + host : '';
		}

		return '';
	} catch (error) {
		return '';
	}
};

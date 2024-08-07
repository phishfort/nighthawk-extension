import { Dispatch } from 'react';
import { browser } from '../../browser-service';
import { EType, EWebStatus } from '../../api/types';
import { ROUTES } from '../components/navigator/routes.utils';
import { FormSelectProps } from '../components/common/form-field-container/types';
import { HOST_KEYS, SOC_MEDIA_TYPES } from '../../common/constants/app-keys.const';
import { removeWWW } from '../../content/utils/index.util';

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

export const pattern = /^(moz-extension:\/\/|chrome-extension:\/\/).+\/warning\.html(\?url=.*)?$/;

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
	let validateUrl = url;
	try {
		const { host } = new URL(url.toLowerCase());
		validateUrl = removeWWW(host);
	} catch (error) {
		console.log(error);
	}
	const socMediaType = Object.entries(SOC_MEDIA_TYPES).reduce(
		(acc, [key, value]) => (validateUrl.includes(value) ? key : acc),
		''
	);

	if (socMediaType && socMediaType !== currentType) {
		const nextOption = getNextOption(socMediaType as EType);
		if (nextOption) setCurrentType(nextOption);
	}

	if (!socMediaType && currentType !== EType.WEBSITE && validateUrl) {
		const nextOption = getNextOption(EType.WEBSITE);
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

export const validateUrl = (url: string, path: string, search?: string): string => {
	const typeOfUrl = url.split('.')[0];

	if (typeOfUrl.includes(EType.FACEBOOK)) {
		if (path.includes('groups')) {
			return `${url}/groups/${path.split('/')[2]}`;
		}

		if (search) {
			return `${url}${path}${search}`;
		}

		return `${url}/${path.split('/')[1]}`;
	}

	if (typeOfUrl.includes(EType.TWITTER)) {
		return `${url}/${path.split('/')[1]}`;
	}

	if (typeOfUrl.includes(EType.LINKEDIN)) {
		return `${url}/${path.split('/')[1]}/${path.split('/')[2]}`;
	}

	if (typeOfUrl.includes(EType.YOUTUBE)) {
		if (path.split('/').length === 3) {
			return `${url}/@${path.split('/')[2]}`;
		}
		return `${url}${path}`;
	}

	if (typeOfUrl.includes(EType.X)) {
		return `${url}/${path.split('/')[1]}`;
	}

	return url;
};

export const getValidUrl = (url: string, noWWW?: boolean) => {
	try {
		const { host, pathname, search } = new URL(url.toLowerCase());
		let dns = host;

		if (host.includes('www.')) {
			dns = host.split('www.')[1];
		}
		const res = validateUrl(dns, pathname, search);

		return noWWW ? res : `www.${res}`;
	} catch (e) {
		console.log(e);
	}
};

export const getUrlType = (url: string) => {
	if (url.includes(EType.FACEBOOK)) return EType.FACEBOOK;
	if (url.includes(EType.TWITTER)) return EType.TWITTER;
	if (url.includes(EType.LINKEDIN)) return EType.LINKEDIN;
	if (url.includes(EType.YOUTUBE)) return EType.YOUTUBE;
	if (url.includes('x.com')) return EType.X;
	return EType.WEBSITE;
};

export const checkUrl = (url: string): string => {
	try {
		const host = removeWWW(new URL(url).host);
		if (host && host != 'newtab') {
			return url ? 'www.' + host : '';
		}

		return '';
	} catch (error) {
		return '';
	}
};

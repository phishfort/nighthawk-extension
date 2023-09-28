import { EType } from '../../api/types';

export const PORT_STORE_NAME = 'night-hawk-port-name';

export const STORAGE_KEYS = {
	ADDRESS: 'ADDRESS',
	TOKEN: 'TOKEN',
	THEME: 'THEME',
	GUEST_TOKEN: 'GUEST_TOKEN',
	GUARDIAN_POINTS: 'GUARDIAN_POINTS',
	AUTH_REDIRECT_URL: 'AUTH_REDIRECT_URL',
	NIGHTHAWK_LIST: 'NIGHTHAWK_LIST',
	NH_CACHE_TIME: 'NH_CACHE_TIME',
	DANGER_AGREE_LIST: 'DANGER_AGREE_LIST',
	TRUSTED_LIST: 'TRUSTED_LIST'
};

export const SOC_MEDIA = {
	YOUTUBE: 'www.youtube.com',
	TWITTER: 'twitter.com',
	FACEBOOK: 'www.facebook.com',
	LINKEDIN: 'linkedin.com'
};

export const HOST_KEYS = {
	...SOC_MEDIA,
	NIGHTHAWK_WEB_VERSION: 'nighthawk-dashboard.phishfort.com',
	GOOGLE: 'www.google.com'
};

export const SOC_MEDIA_TYPES = {
	[EType.YOUTUBE]: 'youtube.com',
	[EType.TWITTER]: 'twitter.com',
	[EType.FACEBOOK]: 'facebook.com',
	[EType.LINKEDIN]: 'linkedin.com'
};

export const checkList = ['google.com', 'github.com'];

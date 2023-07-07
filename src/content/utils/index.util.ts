import { EWebStatus } from '../../api/types';
import { getIconText } from './icon.util';
import { checkList } from '../../common/constants/app-keys.const';

export const getHostFromHref = (href: string) => {
	const { host, pathname, search } = new URL(href);
	if (checkList.includes(removeWWW(host)) && (pathname.length > 1 || search)) {
		return href;
	}

	return host;
};

export const removeWWW = (host: string) => {
	return host.startsWith('www') ? host.slice(4) : host;
};

export const queryStringToObject = (queryString: string) => {
	const pairsString = queryString[0] === '?' ? queryString.slice(1) : queryString;

	const pairs = pairsString.split('&').map((str) => str.split('=').map(decodeURIComponent));

	return pairs.reduce<Record<string, any>>((acc, [key, value]) => {
		if (key) {
			acc[key] = value;
		}

		return acc;
	}, {});
};

export const handleFinishedIcon = (
	finished: Element,
	type: EWebStatus,
	injectedElement: Element,
	createIconHandler: Function,
	left?: number
) => {
	const iconElement = finished as HTMLElement;
	const iconText = iconElement.innerText;

	if (type === EWebStatus.UNKNOWN) {
		iconElement.remove();
	}

	if (getIconText(type) !== iconText && type !== EWebStatus.UNKNOWN) {
		iconElement.remove();
		createIconHandler(type, injectedElement as HTMLElement, left);
	}
};

export const getOriginFromHref = (href: string) => {
	return (href?.match(/([(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\-\+~#=]{2,256}\.[a-z]{2,6})/) || [])[0];
};

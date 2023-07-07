import { createIconBadge } from '../../utils/icon.util';
import { EWebStatus } from '../../../api/types';

export const getYoutubeAcc = (href: string) => {
	const { pathname, searchParams } = new URL(href);
	let validUrl = pathname;

	// channel
	if (
		pathname.startsWith('/channel/') ||
		pathname.startsWith('/c/') ||
		pathname.startsWith('/user/') ||
		pathname.startsWith('/@')
	) {
		const keyWords = ['channel', 'c', 'user'];
		validUrl = pathname.split('/').filter((el) => el && !keyWords.includes(el.toLowerCase()))[0];
		if (validUrl.startsWith('@')) {
			return validUrl.substring(1);
		}
		return validUrl;
	}

	//video
	if (pathname === '/watch' && searchParams.get('v')) {
		return searchParams.get('v') || validUrl;
	}

	return validUrl;
};

export const createYoutubeVideoIcon = (type: EWebStatus, element: Element) => {
	const icon = createIconBadge(type, {
		width: 17,
		height: 17,
		fontSize: 10,
		mt: 2,
		pt: 2
	});
	element.append(icon);
};

export const createYoutubeChanelIcon = (type: EWebStatus, element: HTMLElement) => {
	const badge = createIconBadge(type, {
		width: 21,
		height: 21,
		fontSize: 12,
		pt: 1,
		mt: 1
	});
	element.style.display = 'flex';
	element.style.alignItems = 'center';
	element.append(badge);
};

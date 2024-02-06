import { EWebStatus } from '../../../api/types';
import { createIconBadge } from '../../utils/icon.util';

export const createTwitterIcon = (type: EWebStatus, block: Element) => {
	const icon = createIconBadge(type, {
		width: 18,
		height: 18,
		fontSize: 11,
		pt: 1
	});

	const name = block as HTMLElement;
	name.style.display = 'flex';
	name.style.alignItems = 'center';
	name.append(icon);
};

export const getTweeterAcc = (pathname: string) => {
	return pathname.split('/').filter(Boolean)[0];
};

export const getTweetAuthorAcc = (pathname: string) => {
	const arr = pathname.split('/').filter(Boolean);
	return arr[arr.length - 1];
};

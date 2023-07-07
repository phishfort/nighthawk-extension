import { EWebStatus } from '../../../api/types';
import { createIconBadge } from '../../utils/icon.util';

export const createLinkedinIcon = (type: EWebStatus, block: HTMLElement, pt = 1) => {
	const icon = createIconBadge(type, {
		width: 18,
		height: 18,
		fontSize: 11,
		pt,
		top: 3
	});
	block.style.display = 'flex';
	block.style.alignItems = 'center';
	block.append(icon);
};

export const getLinkedinAcc = (pathname: string) => {
	const arr = pathname.split('/').filter(Boolean);
	return arr[arr.length - 1];
};

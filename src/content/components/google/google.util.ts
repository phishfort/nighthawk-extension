import { EWebStatus } from '../../../api/types';
import { createIconBadge } from '../../utils/icon.util';
import { createDangerousHeader } from '../../utils/dangerous-header.util';
import { queryStringToObject } from '../../utils/index.util';

export const setIcon = (title: HTMLElement, type: EWebStatus) => {
	const { width } = title.getBoundingClientRect();

	const overCallback = () => {
		title.style.width = 'auto';
	};
	const outCallback = () => {
		title.style.width = `${width + 22}px`;
	};

	const icon = createIconBadge(type, {
		width: 18,
		height: 18,
		fontSize: 11,
		pt: 4,
		mt: 5,
		textDecorationLine: 'underline',
		zIndex: '0',
		overCallback,
		outCallback
	});

	icon.style.alignItems = 'start';
	title.style.display = 'flex';
	title.style.alignItems = 'top';
	title.style.width = `${width + 22}px`;
	title.append(icon);
};

export const setDangerous = (block: HTMLElement, title: HTMLElement, type = 'searchResult') => {
	block.style.paddingTop = type === 'ads' ? '45px' : type === 'favicon' ? '4px' : '20px';
	block.style.boxSizing = 'border-box';
	block.style.border = '2px solid #C30303';
	block.style.position = 'relative';
	block.style.paddingLeft = '30px';
	block.style.marginBottom = '10px';

	const header = createDangerousHeader('THIS AD HAS BEEN FLAGGED AS DANGEROUS');
	block.prepend(header);

	if (title) {
		setIcon(title, EWebStatus.DANGEROUS);
	}
};

export const checkPage = (location: Location) => {
	const { search } = location;
	if (search) {
		const searchParams = queryStringToObject(search);
		return !searchParams.tbm;
	}
};

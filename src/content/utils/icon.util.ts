import trustedIcon from '../../assets/images/ic-nighthawk-trusted.png';
import dangerousIcon from '../../assets/images/ic-nighthawk-dangerous.png';
import unknownIcon from '../../assets/images/ic-nighthawk-unknown.png';
import { EWebStatus } from '../../api/types';
import { isMozilla } from '../../browser-service';

export const defineIconName = (type: EWebStatus) => {
	switch (type) {
		case EWebStatus.DANGEROUS:
			return 'ic-nighthawk-dangerous.png';
		case EWebStatus.SAFE:
			return 'ic-nighthawk-trusted.png';
		default:
			return 'ic-nighthawk-unknown.png';
	}
};

export const getIconImg = (type: EWebStatus) => {
	switch (type) {
		case EWebStatus.DANGEROUS:
			return dangerousIcon;
		case EWebStatus.SAFE:
			return trustedIcon;
		default:
			return unknownIcon;
	}
};

export const getBgColor = (type: EWebStatus) => {
	switch (type) {
		case EWebStatus.DANGEROUS:
			return '#C30303';
		case EWebStatus.SAFE:
			return '#20C064';
		default:
			return '#B9BCBE';
	}
};

export const getIconText = (type: EWebStatus) => {
	switch (type) {
		case EWebStatus.DANGEROUS:
			return 'DANGEROUS';
		case EWebStatus.SAFE:
			return 'TRUSTED';
		default:
			return 'UNKNOWN';
	}
};

interface IArguments {
	position?: string;
	width?: number;
	height?: number;
	fontSize?: number;
	mt?: number;
	pt?: number;
	top?: number;
	left?: number;
	textDecorationLine?: string;
	zIndex?: string;
	fontWeight?: string;
	overCallback?: () => void;
	outCallback?: () => void;
}

export const createIconBadge = (
	type: EWebStatus,
	{
		position = 'relative',
		width = 14,
		height = 14,
		fontSize = 9,
		mt = 0,
		pt = 0,
		top = 0,
		left = 0,
		textDecorationLine = 'none',
		zIndex = '10000',
		fontWeight = '500',
		overCallback,
		outCallback
	}: IArguments
) => {
	const badge = document.createElement('div');
	badge.id = 'badge-icon';
	badge.style.height = `${height}px`;
	badge.style.minWidth = `${width}px`;
	badge.style.borderRadius = `${width / 2}px`;
	badge.style.backgroundColor = getBgColor(type);
	badge.style.marginLeft = '4px';
	badge.style.marginTop = `${mt}px`;
	badge.style.position = `${position}`;
	badge.style.top = `${top}px`;
	badge.style.left = `${left}px`;
	badge.style.display = !type || type === EWebStatus.UNKNOWN ? 'none' : 'flex';
	badge.style.alignItems = 'center';
	badge.style.justifyContent = 'end';
	badge.style.transition = 'width 0.4s ease 0s';
	badge.style.cursor = 'pointer';
	badge.style.zIndex = zIndex;
	badge.style.wordBreak = 'keep-all';
	badge.style.textTransform = 'uppercase';

	const img = getIconImg(type);

	const icon = document.createElement('img');
	icon.width = width;
	icon.height = height;
	icon.src = img;
	icon.style.zIndex = '10000';
	icon.style.position = 'relative';
	icon.style.top = '0px';
	icon.style.left = '0px';
	icon.style.cursor = 'pointer';

	const text = document.createElement('div');
	text.style.fontWeight = fontWeight;
	text.style.color = 'white';
	text.style.fontSize = `${fontSize}px`;
	text.style.lineHeight = `${fontSize}px`;
	text.style.height = `${fontSize}px`;
	text.style.paddingTop = `${pt}px`;
	text.style.paddingLeft = `3px`;
	text.style.fontFamily = 'Helvetica';
	text.style.display = 'none';
	text.style.textDecorationLine = textDecorationLine;
	text.style.textDecorationColor = getBgColor(type);
	if (isMozilla) {
		text.style.textDecorationThickness = '3px';
	}

	text.append(getIconText(type));
	badge.append(text);

	const handleMouseOver = () => {
		badge.style.paddingRight = '7px';
		badge.style.minWidth = 'auto';
		text.style.display = 'inline-block';

		if (overCallback) {
			overCallback();
		}
	};

	icon.onmouseover = () => {
		handleMouseOver();
	};

	badge.onmouseover = () => {
		handleMouseOver();
	};

	const handleMouseOut = () => {
		badge.style.padding = '0px';
		badge.style.minWidth = `${width}px`;
		text.style.display = 'none';

		if (outCallback) {
			outCallback();
		}
	};

	icon.onmouseout = () => {
		handleMouseOut();
	};
	badge.onmouseout = () => {
		handleMouseOut();
	};

	badge.prepend(icon);

	return badge;
};

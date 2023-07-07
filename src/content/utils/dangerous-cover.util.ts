import logoImg from '../../assets/images/logo.png';
import { browser } from '../../browser-service';

export const createDangerousCover = ({ text = 'THIS ACCOUNT HAS BEEN FLAGGED AS DANGEROUS', size = 'medium' }) => {
	const headFontSize = size === 'small' ? '28px' : '48px';
	const textFontSize = size === 'small' ? '16px' : '24px';
	const imageWidth = size === 'small' ? '125px' : '200px';

	const cover = document.createElement('div');
	cover.id = 'dangerous-account-cover';
	cover.style.display = 'flex';
	cover.style.justifyContent = 'center';
	cover.style.alignItems = 'center';
	cover.style.width = '100%';
	cover.style.height = '100%';
	cover.style.position = 'absolute';
	cover.style.top = '0px';
	cover.style.left = '0px';

	const image = document.createElement('img');
	image.src = browser?.runtime?.getURL('static/media/bg-low-poly-red.bae263b671da993ff138.png');
	image.style.objectFit = 'cover';
	image.style.width = '100%';
	image.style.height = '100%';
	image.style.zIndex = '333';

	const logo = document.createElement('img');
	logo.src = logoImg;
	logo.style.width = imageWidth;
	logo.style.position = 'absolute';
	logo.style.zIndex = '999';
	logo.style.right = '25px';
	logo.style.bottom = '15px';

	const textContainer = document.createElement('div');
	textContainer.style.display = 'flex';
	textContainer.style.flexDirection = 'column';
	textContainer.style.justifyContent = 'center';
	textContainer.style.alignItems = 'center';
	textContainer.style.width = '100%';
	textContainer.style.height = '100%';
	textContainer.style.color = 'white';
	textContainer.style.fontFamily = 'Helvetica';
	textContainer.style.position = 'absolute';
	textContainer.style.top = '0px';
	textContainer.style.left = '0px';
	textContainer.style.zIndex = '999';

	const headText = document.createElement('div');
	headText.style.fontSize = headFontSize;

	const warningText = document.createElement('div');
	warningText.style.fontSize = textFontSize;

	headText.append('WARNING');
	warningText.append(text);
	textContainer.append(headText, warningText);

	cover.append(image);
	cover.append(textContainer);
	cover.append(logo);

	return cover;
};

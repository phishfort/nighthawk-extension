import logoImg from '../../assets/images/hawk-logo.png';
import { browser } from '../../browser-service';

export const createDangerousHeader = (text = 'THIS ACCOUNT HAS BEEN FLAGGED AS DANGEROUS') => {
	const header = document.createElement('div');
	header.id = 'dangerous-border';
	header.style.display = 'flex';
	header.style.justifyContent = 'space-between';
	header.style.alignItems = 'center';
	header.style.width = 'calc(100% + 2px)';
	header.style.height = '40px';
	header.style.position = 'absolute';
	header.style.top = '0px';
	header.style.left = '-1px';

	const image = document.createElement('img');
	image.src = browser?.runtime?.getURL('static/media/bg-low-poly-red.bae263b671da993ff138.png');
	image.style.objectFit = 'cover';
	image.style.width = 'calc(100% + 2px)';
	image.style.height = 'calc(100% + 1px)';
	image.style.zIndex = '2';

	const logoContainer = document.createElement('div');
	logoContainer.style.display = 'flex';
	logoContainer.style.alignItems = 'center';
	logoContainer.style.height = '40px';
	logoContainer.style.position = 'absolute';
	logoContainer.style.left = '15px';
	logoContainer.style.top = '0px';
	logoContainer.style.zIndex = '3';
	logoContainer.style.color = 'white';
	logoContainer.style.fontSize = '15px';
	logoContainer.style.fontWeight = 'bold';
	logoContainer.style.fontFamily = 'Helvetica';

	const logo = document.createElement('img');
	logo.src = logoImg;
	logo.style.width = '35px';
	logo.style.marginRight = '5px';

	const warningText = document.createElement('div');
	warningText.style.display = 'flex';
	warningText.style.alignItems = 'center';
	warningText.style.height = '40px';
	warningText.style.position = 'absolute';
	warningText.style.right = '15px';
	warningText.style.top = '0px';
	warningText.style.zIndex = '3';
	warningText.style.color = 'white';
	warningText.style.fontSize = '14px';
	warningText.style.fontFamily = 'Helvetica';

	logoContainer.prepend(logo);
	logoContainer.append('WARNING');
	warningText.append(text);
	header.append(image);
	header.append(logoContainer);
	header.append(warningText);

	return header;
};

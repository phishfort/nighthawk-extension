import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { createDangerousCover } from '../../utils/dangerous-cover.util';
import { ECheckDataType, EWebStatus } from '../../../api/types';
import { useAppSelector } from '../../../event/store';
import { checkScam, selectCheckDataFacebook } from '../../../popup/features/store/scam';
import storeWithMiddleware from '../../../common/mockStore';
import { createFBProfileIcon, getFBAcc } from './facebook.util';
import { createIconBadge } from '../../utils/icon.util';
import { includedPaths } from './index';

const FacebookProfileContentPage: React.FC = () => {
	const location = document.location;
	const { pathname } = location;
	const isSuggestions = includedPaths.some((el) => pathname.includes(el));
	const checkData = useAppSelector(selectCheckDataFacebook);
	const [forceRefresh, setForceRefresh] = useState(true);
	const [elementWidth, setElementWidth] = useState(0);

	const iconRef = useRef<HTMLElement | null>(null);
	const acc = getFBAcc(location);

	const handleUpdate = () => {
		setForceRefresh((prev) => !prev);
	};

	const handleCheckScam = (url: string) => {
		// @ts-ignore
		storeWithMiddleware.then(({ dispatch }) => dispatch(checkScam({ type: ECheckDataType.FACEBOOK, url })));
	};

	useEffect(() => {
		handleCheckScam(acc);
		window.addEventListener('DOMSubtreeModified', handleUpdate);
		return () => {
			window.removeEventListener('DOMSubtreeModified ', handleUpdate);
		};
	}, []);

	if (checkData && checkData[acc] === EWebStatus.UNKNOWN) return null;

	const main = document.querySelector('div[role=main]');

	const mainUserNames = main?.querySelectorAll('h1');
	const userNames =
		(mainUserNames && mainUserNames.length) || isSuggestions ? mainUserNames : document.querySelectorAll('h1');

	const accNames = main?.querySelectorAll('h2[dir=auto]');

	const userName = (
		accNames && accNames.length > 1 ? accNames[0] : userNames && userNames[userNames.length - 1]
	) as HTMLElement;

	const coverWithoutImage = main?.children[0]?.children[0];

	const coverImage: HTMLElement | null = document.querySelector('[data-imgperflogname=profileCoverPhoto]');

	const coverEl = coverImage || coverWithoutImage;

	const parentNode = userName?.parentNode;
	const closestNode = userName?.closest('div');

	if (coverEl) {
		const parentLinkNode = coverEl.closest('a');
		const parentNotLinkNode = coverEl.parentNode?.parentNode?.parentNode;
		const parentNode = parentLinkNode || parentNotLinkNode;
		const cover = coverImage ? (parentNode as HTMLElement) : coverEl;

		const finished = cover?.querySelector('#dangerous-account-cover');

		if (!finished && cover && checkData && checkData[acc] === EWebStatus.DANGEROUS) {
			const alreadyFinished = document.querySelectorAll('#dangerous-account-cover');
			if (alreadyFinished.length) {
				alreadyFinished.forEach((el) => el.remove());
			}

			const coverOptions = coverImage && parentNode === parentNotLinkNode ? { size: 'small' } : {};
			const dangerousCover = createDangerousCover(coverOptions);
			cover.prepend(dangerousCover);
		}
	}

	if (userName && parentNode && closestNode && parentNode !== closestNode) {
		const finished = userName?.querySelector('#badge-icon');

		if (!finished && checkData && checkData[acc]) {
			iconRef.current = createIconBadge(checkData[acc], {
				width: 22,
				height: 22,
				fontSize: 13,
				pt: 1,
				fontWeight: '600',
				top: 2
			});

			const container = document.createElement('span');
			container.style.minWidth = '120px';
			iconRef.current.style.display = 'inline-flex';
			container.append(iconRef.current);
			userName.append(container);
		}
	}

	if (userName && parentNode && closestNode && parentNode === closestNode) {
		const parent = parentNode as HTMLElement;
		const finished = parent?.querySelector('#badge-icon');
		const { width: nameWidth } = parent.getBoundingClientRect();
		const companyName = userName?.querySelector('span')?.querySelector('span');
		const companyNameWidth = companyName && companyName.getBoundingClientRect().width;
		const top = userName.tagName === 'H2' ? 0 : 12;
		const width = userName.tagName === 'H1' ? nameWidth : companyNameWidth;

		if (!finished && checkData && checkData[acc] && width) {
			iconRef.current = createFBProfileIcon(checkData[acc], top, width + 4);

			parent.style.position = 'relative';
			parent.style.width = `auto`;
			parent.append(iconRef.current);
			setElementWidth(width);
		}

		if (finished && iconRef.current && width && width !== elementWidth) {
			iconRef.current.remove();
			iconRef.current = createFBProfileIcon(checkData[acc], top, width + 4);

			parent.append(iconRef.current);
			setElementWidth(width);
		}
	}

	return <></>;
};

export default FacebookProfileContentPage;

import * as React from 'react';
import { useEffect, useState } from 'react';
import { createIconBadge } from '../../utils/icon.util';
import { createDangerousCover } from '../../utils/dangerous-cover.util';
import { ECheckDataType, EWebStatus } from '../../../api/types';
import { useAppSelector } from '../../../event/store';
import { checkScam, selectCheckDataFacebook } from '../../../popup/features/store/scam';
import storeWithMiddleware from '../../../common/mockStore';
import { getFBGroup } from './facebook.util';

const FacebookGroupContentPage: React.FC = () => {
	const { pathname } = document.location;
	const checkData = useAppSelector(selectCheckDataFacebook);
	const [forceRefresh, setForceRefresh] = useState(true);

	const group = getFBGroup(pathname);

	const handleUpdate = () => {
		setForceRefresh((prev) => !prev);
	};

	const handleCheckScam = (url: string) => {
		// @ts-ignore
		storeWithMiddleware.then(({ dispatch }) => dispatch(checkScam({ type: ECheckDataType.FACEBOOK, url })));
	};

	useEffect(() => {
		handleCheckScam(group);
		window.addEventListener('DOMSubtreeModified', handleUpdate);
		return () => {
			window.removeEventListener('DOMSubtreeModified ', handleUpdate);
		};
	}, []);

	if (checkData && checkData[group] === EWebStatus.UNKNOWN) return null;

	const groupNames = document.querySelectorAll('h1');

	let groupName = groupNames[0] as HTMLElement;

	groupNames.forEach((el) => {
		const name = el as HTMLElement;
		if (name.querySelector('a')) {
			groupName = name;
		}
	});

	const coverImage: HTMLElement | null = document.querySelector('[data-imgperflogname=profileCoverPhoto]');

	const parentNode = groupName?.parentNode;
	const closestNode = groupName?.closest('div');

	if (groupName && parentNode !== closestNode) {
		return null;
	}

	if (coverImage) {
		const parentNode = coverImage.closest('a');
		const cover = parentNode as HTMLElement;
		const finished = cover?.querySelector('#dangerous-account-cover');

		if (!finished && cover && checkData && checkData[group] === EWebStatus.DANGEROUS) {
			const dangerousCover = createDangerousCover({});
			cover.prepend(dangerousCover);
		}
	}

	if (groupName && parentNode === closestNode) {
		const parent = parentNode as HTMLElement;
		const finished = parent?.querySelector('#badge-icon');
		const a = parent?.querySelector('a');

		if (!finished && parent && a && checkData && checkData[group]) {
			const { width } = a.getBoundingClientRect();
			const icon = createIconBadge(checkData[group], {
				position: 'absolute',
				width: 22,
				height: 22,
				fontSize: 13,
				left: width + 4,
				pt: 1,
				fontWeight: '600'
			});
			parent.style.position = `relative`;
			parent.append(icon);
		}
	}

	return <></>;
};

export default FacebookGroupContentPage;

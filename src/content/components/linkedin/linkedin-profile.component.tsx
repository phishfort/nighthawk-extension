import * as React from 'react';
import { useEffect, useState } from 'react';
import { createDangerousCover } from '../../utils/dangerous-cover.util';
import { ECheckDataType, EWebStatus } from '../../../api/types';
import { useAppSelector } from '../../../event/store';
import { checkScam, selectCheckDataLinkedin } from '../../../popup/features/store/scam';
import storeWithMiddleware from '../../../common/mockStore';
import { createLinkedinIcon, getLinkedinAcc } from './linkedin.util';
import { handleFinishedIcon } from '../../utils/index.util';

const LinkedinProfileContentPage: React.FC = () => {
	const { pathname } = document.location;
	const checkData = useAppSelector(selectCheckDataLinkedin);
	const acc = getLinkedinAcc(pathname);
	const [forceRefresh, setForceRefresh] = useState(true);

	const handleCheckScam = (url: string) => {
		// @ts-ignore
		storeWithMiddleware.then(({ dispatch }) => dispatch(checkScam({ type: ECheckDataType.LINKEDIN, url })));
	};

	useEffect(() => {
		const cover = document.querySelector('#dangerous-account-cover');
		const icon = document.querySelector('#badge-icon');
		if (cover) cover.remove();
		if (icon) icon.remove();
		handleCheckScam(acc);
	}, [acc]);

	const handleCheckCompleteUpdate = () => {
		setTimeout(() => {
			setForceRefresh((prev) => !prev);
		}, 1500);
	};

	useEffect(() => {
		handleCheckCompleteUpdate();
	}, [pathname]);

	const coverImage: HTMLElement | null =
		document.querySelector('.live-video-hero-image') || document.querySelector('div.cover-img__image-frame');
	const photo: HTMLElement | null =
		document.querySelector('.pv-top-card--photo') || document.querySelector('.top-card__profile-image');

	if (coverImage && photo && checkData && checkData[acc]) {
		const finished = coverImage.querySelector('#dangerous-account-cover');

		if (!finished && checkData[acc] === EWebStatus.DANGEROUS) {
			const dangerousCover = createDangerousCover({ size: 'small' });
			photo.style.zIndex = '9999';
			coverImage.style.position = 'relative';
			coverImage.style.borderRadius = '0px';
			coverImage.prepend(dangerousCover);
		}

		if (finished && checkData[acc] !== EWebStatus.DANGEROUS) {
			finished.remove();
		}
	}

	// @ts-ignore
	const userName: HTMLElement | null | undefined =
		document.querySelector('h1.text-heading-xlarge') || document.querySelector('span[dir=ltr]');
	const notAuthUserName = document.querySelector('h1.top-card-layout__title');

	const parentNode = notAuthUserName ? notAuthUserName : (userName?.parentNode as HTMLElement);

	useEffect(() => {
		const icon = document.querySelector('#badge-icon');
		if (
			checkData?.[acc] &&
			(checkData?.[acc] === EWebStatus.SAFE || checkData?.[acc] === EWebStatus.DANGEROUS) &&
			!icon
		) {
			handleCheckScam(acc);
		}
	}, [checkData?.[acc]]);

	if (parentNode && checkData && checkData[acc]) {
		const parent = parentNode as HTMLElement;
		const addName = parent.querySelector('span');

		if (addName && checkData[acc] !== EWebStatus.UNKNOWN) {
			addName.style.paddingLeft = '4px';
		}

		const finished = parent?.querySelector('#badge-icon');
		const pt = notAuthUserName ? 0 : 1;

		if (!finished && checkData[acc] !== EWebStatus.UNKNOWN) {
			createLinkedinIcon(checkData[acc], parent, pt);
		}

		if (finished) {
			handleFinishedIcon(finished, checkData[acc], parent, createLinkedinIcon, pt);
		}
	}

	return <></>;
};

export default LinkedinProfileContentPage;

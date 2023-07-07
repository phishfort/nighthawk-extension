import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../event/store';
import { checkScam, selectCheckDataYoutube } from '../../../popup/features/store/scam';
import storeWithMiddleware from '../../../common/mockStore';
import { ECheckDataType, EWebStatus } from '../../../api/types';
import { createDangerousCover } from '../../utils/dangerous-cover.util';
import { createYoutubeChanelIcon, getYoutubeAcc } from './youtube.util';
import { handleFinishedIcon } from '../../utils/index.util';

const YoutubeChannelContentPage: React.FC = () => {
	const { href } = document.location;
	const checkData = useAppSelector(selectCheckDataYoutube);
	const [forceRefresh, setForceRefresh] = useState(true);

	const handleCheckScam = (url: string) => {
		// @ts-ignore
		storeWithMiddleware.then(({ dispatch }) => dispatch(checkScam({ type: ECheckDataType.YOUTUBE, url })));
	};

	const nameElement: HTMLElement | null = document.querySelector('#channel-name.ytd-c4-tabbed-header-renderer');

	const accElement: HTMLElement | null = document.getElementById('channel-handle'); // backup plan for future
	const acc = getYoutubeAcc(href) || accElement?.innerText.substring(1);

	useEffect(() => {
		if (nameElement && accElement && acc) {
			handleCheckScam(acc);
		}
	}, [href, nameElement, acc]);

	useEffect(() => {
		if (checkData && acc && !checkData[acc]) {
			const cover = document.querySelector('#dangerous-account-cover');
			const icon = document.querySelector('#badge-icon');
			if (cover) cover.remove();
			if (icon) icon.remove();
		}
	}, [acc]);

	if (nameElement && checkData && acc && checkData[acc]) {
		const finished = nameElement.querySelector('#badge-icon');

		if (finished) {
			handleFinishedIcon(finished, checkData[acc], nameElement, createYoutubeChanelIcon);
		}

		if (!finished && checkData[acc] !== EWebStatus.UNKNOWN) {
			createYoutubeChanelIcon(checkData[acc], nameElement as HTMLElement);
		}
	}

	const coverImage: HTMLElement | null = document.querySelector(
		'div.banner-visible-area.style-scope.ytd-c4-tabbed-header-renderer'
	);

	if (coverImage && checkData && acc && checkData[acc]) {
		const finished = coverImage.querySelector('#dangerous-account-cover');

		if (finished && checkData[acc] !== EWebStatus.DANGEROUS) {
			finished.remove();
		}

		if (!finished && checkData[acc] === EWebStatus.DANGEROUS) {
			const dangerousCover = createDangerousCover({ size: 'small' });
			coverImage.style.position = 'relative';
			coverImage.prepend(dangerousCover);
		}
	}

	const handleUpdateTitleEvent = () => {
		setForceRefresh((prev) => !prev);
	};

	useEffect(() => {
		document.addEventListener('yt-update-title', handleUpdateTitleEvent);
		return () => {
			document.removeEventListener('yt-update-title', handleUpdateTitleEvent);
		};
	}, []);

	return <></>;
};

export default YoutubeChannelContentPage;

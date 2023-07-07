import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../event/store';
import { checkScam, selectCheckDataYoutube } from '../../../popup/features/store/scam';
import storeWithMiddleware from '../../../common/mockStore';
import { createYoutubeVideoIcon, getYoutubeAcc } from './youtube.util';
import { ECheckDataType, EWebStatus } from '../../../api/types';
import { handleFinishedIcon } from '../../utils/index.util';

const YoutubeVideoContentPage: React.FC = () => {
	const { href } = document.location;
	const checkData = useAppSelector(selectCheckDataYoutube);
	const [forceRefresh, setForceRefresh] = useState(true);
	const [currentUrl, setCurrentUrl] = useState(href);
	const [currentAcc, setCurrentAcc] = useState('');

	const handleCheckScam = (url: string) => {
		// @ts-ignore
		storeWithMiddleware.then(({ dispatch }) => dispatch(checkScam({ type: ECheckDataType.YOUTUBE, url })));
	};

	const nameElement = document.querySelector('#channel-name.ytd-video-owner-renderer');

	const accElement: HTMLAnchorElement | null | undefined = nameElement?.querySelector(
		'a.yt-simple-endpoint.yt-formatted-string'
	); // backup plan for future

	const accHref = accElement?.href;

	useEffect(() => {
		if (!nameElement || !accElement) {
			setForceRefresh((prev) => !prev);
		}
	}, [nameElement, accElement]);

	useEffect(() => {
		if (accHref) {
			const finished = document.querySelector('#badge-icon');
			if (finished) finished.remove();
			const acc = getYoutubeAcc(href);
			setCurrentAcc(acc);
			handleCheckScam(acc);
		}
	}, [accHref]);

	const handleCheckCompleteUpdate = () => {
		setTimeout(() => {
			setForceRefresh((prev) => !prev);
		}, 500);
	};

	useEffect(() => {
		handleCheckCompleteUpdate();
	}, [href]);

	if (nameElement && checkData && checkData[currentAcc]) {
		const finished = nameElement.querySelector('#badge-icon');

		if (finished) {
			handleFinishedIcon(finished, checkData[currentAcc], nameElement, createYoutubeVideoIcon);
		}

		if (!finished && checkData[currentAcc] !== EWebStatus.UNKNOWN) {
			createYoutubeVideoIcon(checkData[currentAcc], nameElement);
		}
	}

	const handleUpdateTitleEvent = () => {
		if (currentUrl !== href) {
			setCurrentUrl(href);
			setCurrentAcc('');
		}
		if (currentUrl === href && checkData && checkData[currentAcc]) {
			return;
		}
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

export default YoutubeVideoContentPage;

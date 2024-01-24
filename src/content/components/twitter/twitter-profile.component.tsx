import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../event/store';
import { checkScam, selectCheckDataTwitter } from '../../../popup/features/store/scam';
import storeWithMiddleware from '../../../common/mockStore';
import { createTwitterIcon, getTweeterAcc } from './twitter.util';
import { ECheckDataType, EWebStatus } from '../../../api/types';
import { handleFinishedIcon } from '../../utils/index.util';

let injected = false;
const TwitterProfileContentPage: React.FC = () => {
	const { pathname } = document.location;
	const checkData = useAppSelector(selectCheckDataTwitter);
	const [userName, setUserName] = useState<Element | HTMLElement | undefined | null>(null);
	const acc = getTweeterAcc(pathname);

	const handleCheckScam = (url: string) => {
		storeWithMiddleware.then(({ dispatch }) =>
			// @ts-ignore
			dispatch(checkScam({ type: ECheckDataType.TWITTER, url }))
		);
	};

	useEffect(() => {
		injected = false;
		handleCheckScam(acc);
	}, [acc]);

	const handleUpdate = () => {
		const emptyState = document.querySelector('div[data-testid=emptyState]');
		const userContainer = document.querySelector('[data-testid=UserName]');

		if (!injected && (userContainer || emptyState)) {
			const usernameContainer = userContainer?.querySelectorAll('[dir=ltr]')[1];
			const span = usernameContainer?.querySelectorAll('span')[0];
			const closerDiv = span?.closest('div');
			const parentDiv = span?.parentElement;
			const userNameEl = closerDiv || parentDiv;

			if (!injected && userNameEl) {
				setUserName(userNameEl);
				injected = true;
			}
		}
	};

	useEffect(() => {
		window.addEventListener('DOMSubtreeModified', handleUpdate);
		return () => {
			window.removeEventListener('DOMSubtreeModified', handleUpdate);
		};
	}, []);

	useEffect(() => {
		const finished = document.querySelector('#badge-icon');
		if (finished) finished.remove();
	}, [pathname]);

	if (userName && checkData && checkData[acc]) {
		const finished = userName.querySelector('#badge-icon');

		if (!finished && checkData[acc] !== EWebStatus.UNKNOWN) {
			createTwitterIcon(checkData[acc], userName);
		}

		if (finished) {
			handleFinishedIcon(finished, checkData[acc], userName, createTwitterIcon);
		}
	}

	return <></>;
};

export default TwitterProfileContentPage;

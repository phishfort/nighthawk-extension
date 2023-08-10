//@ts-nocheck
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../event/store';
import { getActiveTab, getSourceData, setSourceType } from './features/store/source/sourceSlice';
import { defineIconName } from './utils/icon.util';
import YoutubeContentPage from './components/youtube';
import TokenManagerComponent from './token-manager.component';
import { HOST_KEYS, checkList } from '../common/constants/app-keys.const';
import TwitterContentPage from './components/twitter';
import GoogleContentPage from './components/google';
import FacebookContentPage from './components/facebook';
import LinkedinContentPage from './components/linkedin';
import { EWebStatus } from '../api/types';
import storeWithMiddleware from '../common/mockStore';
import { checkSourceType } from './features/store/source/actions';
import { getOriginFromHref, removeWWW } from './utils/index.util';
import { browser } from '../browser-service';
import { selectIsAuth } from '../popup/features/store/auth';
import MessageManagerComponent from './message-manager.component';

const isSafeSuspect = (href: string) => {
	const dangerousProtocol = ['javascript:'];
	const suspectUrl = new URL(href);

	return dangerousProtocol.indexOf(suspectUrl.protocol) < 0;
};

function ContentComponent() {
	const { host, href, pathname, search } = document.location;
	let cutHost = removeWWW(host);
	if (checkList.includes(cutHost) && (pathname.length > 1 || search)) {
		cutHost = href;
	}

	const sourceData = useAppSelector(getSourceData);
	const activeTab = useAppSelector(getActiveTab);
	const isAuth = useAppSelector(selectIsAuth);
	const activeOrigin = getOriginFromHref(activeTab);
	const handleCheckSourceType = (host: string) => {
		// @ts-ignore
		storeWithMiddleware.then(({ dispatch }) => dispatch(checkSourceType(host)));
	};

	useEffect(() => {
		if (href === activeTab) {
			handleCheckSourceType(cutHost);
		}
	}, [host, activeOrigin, isAuth]);

	useEffect(() => {
		if (href.includes(`${process.env.REACT_APP_NIGHTHAWK_WARNING}`)) {
			browser?.runtime?.sendMessage({ newIconPath: '/assets/logo/ic-nighthawk-dangerous.png' }, (response) => response);
		} else if (sourceData && sourceData[cutHost]) {
			browser?.runtime?.sendMessage(
				{ newIconPath: `/assets/logo/${defineIconName(sourceData[cutHost])}` },
				(response) => response
			);
		}
	}, [sourceData?.[cutHost]]);

	return (
		<>
			{sourceData &&
				sourceData[cutHost] === EWebStatus.DANGEROUS &&
				isSafeSuspect(href) &&
				window.location.replace(`${process.env.REACT_APP_NIGHTHAWK_WARNING}?url=${href}`)}

			{host === HOST_KEYS.YOUTUBE && <YoutubeContentPage />}
			{host === HOST_KEYS.NIGHTHAWK_WEB_VERSION && <TokenManagerComponent />}
			{href.includes(new URL(`${process.env.REACT_APP_NIGHTHAWK_WARNING}`).host) && <MessageManagerComponent />}
			{host === HOST_KEYS.TWITTER && <TwitterContentPage />}
			{host === HOST_KEYS.GOOGLE && <GoogleContentPage />}
			{host === HOST_KEYS.FACEBOOK && <FacebookContentPage />}
			{host.includes(HOST_KEYS.LINKEDIN) && <LinkedinContentPage />}
		</>
	);
}

export default ContentComponent;

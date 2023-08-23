//@ts-nocheck
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../event/store';
import DangerousContentPage from './components/dangerous';
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

function ContentComponent() {
	const { host, href, pathname, search } = document.location;
	let cutHost = removeWWW(host);
	if (checkList.includes(cutHost) && (pathname.length > 1 || search)) {
		cutHost = href;
	}
	const dispatch = useAppDispatch();
	const sourceData = useAppSelector(getSourceData);
	const activeTab = useAppSelector(getActiveTab);
	const isAuth = useAppSelector(selectIsAuth);
	const activeOrigin = getOriginFromHref(activeTab);

	const handleCheckSourceType = (host: string) => {
		storeWithMiddleware.then(({ dispatch }) => dispatch(checkSourceType(host)));
	};

	useEffect(() => {
		if (href === activeTab) {
			// check scam for all user
			handleCheckSourceType(cutHost);
		}
	}, [host, activeOrigin, isAuth]);

	useEffect(() => {
		if (sourceData && sourceData[cutHost]) {
			browser?.runtime?.sendMessage(
				{ newIconPath: `/assets/logo/${defineIconName(sourceData[cutHost])}` },
				(response) => response
			);
		}
	}, [sourceData?.[cutHost]]);

	return (
		<>
			{sourceData && sourceData[cutHost] === EWebStatus.DANGEROUS && <DangerousContentPage />}
			{host === HOST_KEYS.YOUTUBE && <YoutubeContentPage />}
			{host === HOST_KEYS.NIGHTHAWK_WEB_VERSION && <TokenManagerComponent />}
			{host === HOST_KEYS.TWITTER && <TwitterContentPage />}
			{host === HOST_KEYS.GOOGLE && <GoogleContentPage />}
			{host === HOST_KEYS.FACEBOOK && <FacebookContentPage />}
			{host.includes(HOST_KEYS.LINKEDIN) && <LinkedinContentPage />}
		</>
	);
}

export default ContentComponent;

//@ts-nocheck
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../event/store';
import { getActiveTab, getSourceData } from './features/store/source/sourceSlice';
import { defineIconName } from './utils/icon.util';
import YoutubeContentPage from './components/youtube';
import TokenManagerComponent from './token-manager.component';
import { HOST_KEYS } from '../common/constants/app-keys.const';
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
import Website from '../rule-engine/website';
import RuleEngine from '../rule-engine/rule';
import { storageService } from '../api/services';
import { getValidUrl } from '../api/utils/validate-url';

function ContentComponent() {
	const { host, href, pathname, search } = document.location;
	let cutHost = removeWWW(host);

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
		if (!sourceData || !cutHost) {
			return;
		}

		const hostStatus = sourceData[cutHost];
		if (hostStatus && !hostStatus.includes(EWebStatus.UNKNOWN)) {
			browser?.runtime?.sendMessage({
				newIconPath: `/assets/logo/${defineIconName(hostStatus)}`
			});
		}
	}, [sourceData, cutHost]);

	useEffect(() => {
		const website = new Website(document).toJSON();
		storageService.getDangerAgreeListFromStorage().then((list: string[]) => {
			if (list?.length > 0 && list?.some((dangerUrl) => getValidUrl(dangerUrl) === getValidUrl(website?.url))) return;
			else if (!website.url.includes('chrome-extension://')) {
				const ruleEngine = new RuleEngine();
				ruleEngine.checkWebsite(website).then((result) => {
					if (result.status === 'flagged') {
						browser.runtime.sendMessage({
							redirectUrl: website.url,
							action: 'redirectUrl'
						});
					}
				});
			}
		});
	}, []);

	return (
		<>
			{host === HOST_KEYS.YOUTUBE && <YoutubeContentPage />}
			{host === HOST_KEYS.NIGHTHAWK_WEB_VERSION && <TokenManagerComponent />}
			{href.includes(new URL(`${process.env.REACT_APP_WEB_URL}`).host) && <MessageManagerComponent />}
			{host === HOST_KEYS.TWITTER && <TwitterContentPage />}
			{host === HOST_KEYS.GOOGLE && <GoogleContentPage />}
			{host === HOST_KEYS.FACEBOOK && <FacebookContentPage />}
			{host.includes(HOST_KEYS.LINKEDIN) && <LinkedinContentPage />}
		</>
	);
}

export default ContentComponent;

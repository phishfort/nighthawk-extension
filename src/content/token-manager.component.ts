import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../event/store';
import {
	selectAuthData,
	selectAuthRedirectUrl,
	selectShouldLogoutWeb,
	setAuthData,
	setAuthRedirectUrl,
	setShouldLogoutWeb
} from '../popup/features/store/auth';
import { localStorageService } from '../api/services/local-storage.service';
import { browser } from '../browser-service';
import { storageService } from '../api/services';
import { selectGuestGuardianPoints } from '../popup/features/store/user';

function tokenMessageHandler(e: MessageEvent) {
	if (e.source !== window) return;
	if (e.origin !== process.env.REACT_APP_WEB_URL) return;

	if (e.data.type && e.data.type === process.env.REACT_APP_WEB_LOGIN) {
		const port = browser?.runtime?.connect({ name: process.env.REACT_APP_WEB_LOGIN });
		port.postMessage({ token: e.data.token, isGuest: e.data.isGuest });
	}

	if (e.data.type && e.data.type === process.env.REACT_APP_WEB_LOGOUT) {
		browser?.runtime?.connect({ name: process.env.REACT_APP_WEB_LOGOUT });
	}

	if (e.data.type && e.data.type === process.env.REACT_APP_WEB_GUARDIAN_POINTS) {
		const port = browser?.runtime?.connect({ name: process.env.REACT_APP_WEB_GUARDIAN_POINTS });
		port.postMessage({ points: e.data.points });
	}
}

const TokenManagerComponent = () => {
	const authData = useAppSelector(selectAuthData);
	const shouldLogoutWeb = useAppSelector(selectShouldLogoutWeb);
	const authRedirectUrl = useAppSelector(selectAuthRedirectUrl);
	const guestGuardianPoints = useAppSelector(selectGuestGuardianPoints);
	const dispatch = useAppDispatch();

	function initTokenHandling() {
		const userWebToken = localStorageService.getWebTokenFromStorage();
		const guestWebToken = localStorageService.getWebGuestTokenFromStorage();
		const webToken = userWebToken || guestWebToken;

		if (shouldLogoutWeb) {
			dispatch(setShouldLogoutWeb(false));
			localStorageService.removeTokenFromStorage();
			if (authRedirectUrl) {
				localStorageService.setAuthRedirectUrlFromStorage(authRedirectUrl);
				dispatch(setAuthRedirectUrl(''));
			}
			window.postMessage({ type: process.env.REACT_APP_EXT_LOGOUT });
		}

		if (!shouldLogoutWeb && webToken && !authData?.token) {
			dispatch(
				setAuthData({
					token: userWebToken || guestWebToken,
					isVerified: !!userWebToken
				})
			);
			userWebToken && storageService.setTokenToStorage(userWebToken);
			guestWebToken && storageService.setGuestTokenToStorage(guestWebToken);
		}

		if (!shouldLogoutWeb && ((!webToken && authData?.token) || (authData?.token && webToken !== authData?.token))) {
			window.postMessage({
				type: process.env.REACT_APP_EXT_LOGIN,
				token: authData.token,
				isGuest: !authData.isVerified
			});
		}
	}

	function initGuardianPointsHandling() {
		if (guestGuardianPoints) {
			window.postMessage({
				type: process.env.REACT_APP_EXT_GUARDIAN_POINTS,
				points: guestGuardianPoints
			});
		}
	}

	useEffect(() => {
		window.addEventListener('message', tokenMessageHandler);
		return () => {
			window.removeEventListener('message', tokenMessageHandler);
		};
	}, []);

	useEffect(() => {
		initTokenHandling();
	}, [authData?.token]);

	useEffect(() => {
		initGuardianPointsHandling();
	}, [guestGuardianPoints]);

	return null;
};

export default React.memo(TokenManagerComponent);

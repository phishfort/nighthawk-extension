import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../event/store';
import {
	selectAuthData,
	selectAuthRedirectUrl,
	selectShouldLogoutWeb,
	setAuthRedirectUrl,
	setShouldLogoutWeb
} from '../popup/features/store/auth';
import { localStorageService } from '../api/services/local-storage.service';
import { browser } from '../browser-service';
import { selectGuestGuardianPoints } from '../popup/features/store/user';
import {
	getDashboardOrigin,
	getGuardianPoints,
	isDashboardUrl,
	isPlainRecord,
	isTrustedDashboardMessage,
	isValidToken
} from '../common/utils/extension-origin.util';

export function tokenMessageHandler(e: MessageEvent) {
	if (!isTrustedDashboardMessage(e) || !isPlainRecord(e.data) || typeof e.data.type !== 'string') return;

	if (
		e.data.type === process.env.REACT_APP_WEB_LOGIN &&
		isValidToken(e.data.token) &&
		typeof e.data.isGuest === 'boolean'
	) {
		const port = browser?.runtime?.connect({ name: process.env.REACT_APP_WEB_LOGIN });
		port?.postMessage({ token: e.data.token, isGuest: e.data.isGuest });
	}

	if (e.data.type === process.env.REACT_APP_WEB_LOGOUT) {
		browser?.runtime?.connect({ name: process.env.REACT_APP_WEB_LOGOUT });
	}

	if (e.data.type === process.env.REACT_APP_WEB_GUARDIAN_POINTS) {
		const points = getGuardianPoints(e.data.points);
		if (points !== null) {
			const port = browser?.runtime?.connect({ name: process.env.REACT_APP_WEB_GUARDIAN_POINTS });
			port?.postMessage({ points });
		}
	}
}

const TokenManagerComponent = () => {
	const authData = useAppSelector(selectAuthData);
	const shouldLogoutWeb = useAppSelector(selectShouldLogoutWeb);
	const authRedirectUrl = useAppSelector(selectAuthRedirectUrl);
	const guestGuardianPoints = useAppSelector(selectGuestGuardianPoints);
	const dispatch = useAppDispatch();

	function initTokenHandling() {
		const dashboardOrigin = getDashboardOrigin();
		if (!dashboardOrigin || !isDashboardUrl(window.location.href)) return;
		const userWebToken = localStorageService.getWebTokenFromStorage();
		const guestWebToken = localStorageService.getWebGuestTokenFromStorage();
		const validUserToken = isValidToken(userWebToken) ? userWebToken : null;
		const validGuestToken = isValidToken(guestWebToken) ? guestWebToken : null;
		const webToken = validUserToken || validGuestToken;

		if (shouldLogoutWeb) {
			dispatch(setShouldLogoutWeb(false));
			localStorageService.removeTokenFromStorage();
			if (authRedirectUrl) {
				localStorageService.setAuthRedirectUrlFromStorage(authRedirectUrl);
				dispatch(setAuthRedirectUrl(''));
			}
			window.postMessage({ type: process.env.REACT_APP_EXT_LOGOUT }, dashboardOrigin);
		}

		if (!shouldLogoutWeb && webToken && !authData?.token) {
			// The background owns account changes, cache invalidation and persistence.
			const port = browser?.runtime?.connect({ name: process.env.REACT_APP_WEB_LOGIN });
			port?.postMessage({ token: webToken, isGuest: !validUserToken });
		}

		if (!shouldLogoutWeb && isValidToken(authData?.token) && webToken !== authData?.token) {
			window.postMessage(
				{
					type: process.env.REACT_APP_EXT_LOGIN,
					token: authData.token,
					isGuest: !authData.isVerified
				},
				dashboardOrigin
			);
		}
	}

	function initGuardianPointsHandling() {
		const dashboardOrigin = getDashboardOrigin();
		if (!dashboardOrigin || !isDashboardUrl(window.location.href)) return;
		const points = getGuardianPoints(guestGuardianPoints);
		if (points !== null) {
			window.postMessage(
				{
					type: process.env.REACT_APP_EXT_GUARDIAN_POINTS,
					points
				},
				dashboardOrigin
			);
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
	}, [authData?.token, authData?.isVerified, shouldLogoutWeb, authRedirectUrl]);

	useEffect(() => {
		initGuardianPointsHandling();
	}, [guestGuardianPoints]);

	return null;
};

export default React.memo(TokenManagerComponent);

import React from 'react';
import { render } from '@testing-library/react';
import { browser } from '../browser-service';
import { localStorageService } from '../api/services/local-storage.service';
import { useAppDispatch, useAppSelector } from '../event/store';
import { isDashboardUrl, isTrustedDashboardMessage } from '../common/utils/extension-origin.util';
import TokenManagerComponent, { tokenMessageHandler } from './token-manager.component';

jest.mock('../browser-service', () => ({ browser: { runtime: { connect: jest.fn() } } }));
jest.mock('../event/store', () => ({ useAppDispatch: jest.fn(), useAppSelector: jest.fn() }));
jest.mock('../popup/features/store/auth', () => ({
	selectAuthData: (state: any) => state.authData,
	selectAuthRedirectUrl: (state: any) => state.authRedirectUrl,
	selectShouldLogoutWeb: (state: any) => state.shouldLogoutWeb,
	setAuthRedirectUrl: (payload: string) => ({ type: 'setAuthRedirectUrl', payload }),
	setShouldLogoutWeb: (payload: boolean) => ({ type: 'setShouldLogoutWeb', payload })
}));
jest.mock('../popup/features/store/user', () => ({
	selectGuestGuardianPoints: (state: any) => state.guestGuardianPoints
}));
jest.mock('../api/services/local-storage.service', () => ({
	localStorageService: {
		getWebTokenFromStorage: jest.fn(),
		getWebGuestTokenFromStorage: jest.fn(),
		removeTokenFromStorage: jest.fn(),
		setAuthRedirectUrlFromStorage: jest.fn()
	}
}));
jest.mock('../common/utils/extension-origin.util', () => ({
	...jest.requireActual('../common/utils/extension-origin.util'),
	isDashboardUrl: jest.fn(),
	isTrustedDashboardMessage: jest.fn()
}));

const connect = browser.runtime.connect as jest.Mock;
const trustedMessage = isTrustedDashboardMessage as jest.Mock;
const dashboardUrl = isDashboardUrl as jest.Mock;
const postPortMessage = jest.fn();
const dispatch = jest.fn();
const event = (data: unknown) => ({ data } as MessageEvent);
let state: {
	authData: { token: string; isVerified: boolean } | null;
	authRedirectUrl: string;
	shouldLogoutWeb: boolean;
	guestGuardianPoints: number | null;
};
let postWindowMessage: jest.SpyInstance;

beforeEach(() => {
	jest.clearAllMocks();
	process.env.REACT_APP_WEB_URL = 'https://dashboard.test';
	process.env.REACT_APP_WEB_LOGIN = 'web-login';
	process.env.REACT_APP_WEB_LOGOUT = 'web-logout';
	process.env.REACT_APP_WEB_GUARDIAN_POINTS = 'web-points';
	process.env.REACT_APP_EXT_LOGIN = 'extension-login';
	process.env.REACT_APP_EXT_LOGOUT = 'extension-logout';
	process.env.REACT_APP_EXT_GUARDIAN_POINTS = 'extension-points';
	state = { authData: null, authRedirectUrl: '', shouldLogoutWeb: false, guestGuardianPoints: null };
	(useAppSelector as jest.Mock).mockImplementation((selector) => selector(state));
	(useAppDispatch as jest.Mock).mockReturnValue(dispatch);
	(localStorageService.getWebTokenFromStorage as jest.Mock).mockReturnValue(null);
	(localStorageService.getWebGuestTokenFromStorage as jest.Mock).mockReturnValue(null);
	trustedMessage.mockReturnValue(true);
	dashboardUrl.mockReturnValue(true);
	connect.mockReturnValue({ postMessage: postPortMessage });
	postWindowMessage = jest.spyOn(window, 'postMessage').mockImplementation(() => {});
});

afterEach(() => {
	postWindowMessage.mockRestore();
});

it('preserves validated login, logout and numeric points messages', () => {
	tokenMessageHandler(event({ type: 'web-login', token: 'dummy-token', isGuest: false }));
	expect(connect).toHaveBeenLastCalledWith({ name: 'web-login' });
	expect(postPortMessage).toHaveBeenLastCalledWith({ token: 'dummy-token', isGuest: false });
	tokenMessageHandler(event({ type: 'web-points', points: '12.5' }));
	expect(connect).toHaveBeenLastCalledWith({ name: 'web-points' });
	expect(postPortMessage).toHaveBeenLastCalledWith({ points: 12.5 });
	tokenMessageHandler(event({ type: 'web-logout' }));
	expect(connect).toHaveBeenLastCalledWith({ name: 'web-logout' });
});

it('does not forward messages that fail the trusted document/event boundary', () => {
	trustedMessage.mockReturnValue(false);
	tokenMessageHandler(event({ type: 'web-login', token: 'dummy-token', isGuest: false }));
	tokenMessageHandler(event({ type: 'web-logout' }));
	tokenMessageHandler(event({ type: 'web-points', points: 1 }));
	expect(connect).not.toHaveBeenCalled();
});

it.each([
	null,
	[],
	{},
	{ type: 'web-login', token: {} },
	{ type: 'web-login', token: '' },
	{ type: 'web-login', token: 'token', isGuest: 'false' },
	{ type: 'web-login', token: 'token' },
	{ type: 'web-points', points: {} },
	{ type: 'web-points', points: -1 },
	{ type: 'web-points', points: '1e2' }
])('ignores malformed messages without throwing: %j', (data) => {
	expect(() => tokenMessageHandler(event(data))).not.toThrow();
	expect(connect).not.toHaveBeenCalled();
});

it('targets extension token and zero-point synchronization to the configured HTTPS origin', () => {
	state.authData = { token: 'dummy-extension-token', isVerified: true };
	state.guestGuardianPoints = 0;
	render(<TokenManagerComponent />);
	expect(postWindowMessage).toHaveBeenCalledWith(
		{ type: 'extension-login', token: 'dummy-extension-token', isGuest: false },
		'https://dashboard.test'
	);
	expect(postWindowMessage).toHaveBeenCalledWith({ type: 'extension-points', points: 0 }, 'https://dashboard.test');
});

it('does not read or synchronize tokens on an untrusted document', () => {
	dashboardUrl.mockReturnValue(false);
	state.authData = { token: 'dummy-extension-token', isVerified: true };
	state.guestGuardianPoints = 42;
	render(<TokenManagerComponent />);
	expect(localStorageService.getWebTokenFromStorage).not.toHaveBeenCalled();
	expect(postWindowMessage).not.toHaveBeenCalled();
	expect(connect).not.toHaveBeenCalled();
});

it('does not synchronize tokens when the configured dashboard URL is insecure', () => {
	process.env.REACT_APP_WEB_URL = 'http://dashboard.test';
	state.authData = { token: 'dummy-extension-token', isVerified: true };
	state.guestGuardianPoints = 42;
	render(<TokenManagerComponent />);
	expect(localStorageService.getWebTokenFromStorage).not.toHaveBeenCalled();
	expect(postWindowMessage).not.toHaveBeenCalled();
	expect(connect).not.toHaveBeenCalled();
});

it.each([
	['dummy-user-token', null, false],
	[null, 'dummy-guest-token', true]
])('bootstraps page identity through the authenticated background login path', (userToken, guestToken, isGuest) => {
	(localStorageService.getWebTokenFromStorage as jest.Mock).mockReturnValue(userToken);
	(localStorageService.getWebGuestTokenFromStorage as jest.Mock).mockReturnValue(guestToken);
	render(<TokenManagerComponent />);
	expect(connect).toHaveBeenCalledWith({ name: 'web-login' });
	expect(postPortMessage).toHaveBeenCalledWith({ token: userToken || guestToken, isGuest });
	expect(dispatch).not.toHaveBeenCalled();
});

it('does not bootstrap a malformed page token', () => {
	(localStorageService.getWebTokenFromStorage as jest.Mock).mockReturnValue(' token\n');
	render(<TokenManagerComponent />);
	expect(connect).not.toHaveBeenCalled();
});

it('targets logout to HTTPS and clears the page token before sending it', () => {
	state.shouldLogoutWeb = true;
	state.authRedirectUrl = '/profile';
	render(<TokenManagerComponent />);
	expect(localStorageService.removeTokenFromStorage).toHaveBeenCalledTimes(1);
	expect(localStorageService.setAuthRedirectUrlFromStorage).toHaveBeenCalledWith('/profile');
	expect(postWindowMessage).toHaveBeenCalledWith({ type: 'extension-logout' }, 'https://dashboard.test');
	expect(connect).not.toHaveBeenCalled();
});

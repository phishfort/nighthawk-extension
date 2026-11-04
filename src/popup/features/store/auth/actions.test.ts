import { configureStore } from '@reduxjs/toolkit';
import { webcrypto } from 'crypto';
import { TextEncoder } from 'util';
import reducer from '../../../../event/store/reducers';
import { browser } from '../../../../browser-service';
import { authService, storageService } from '../../../../api/services';
import { getUserAuthInfo, userGuestAuth } from './actions';
import { setAuthData, signOut } from './slice';
import { STORAGE_KEYS } from '../../../../common/constants/app-keys.const';

jest.mock('../../../../browser-service', () => ({
	browser: {
		storage: { local: { get: jest.fn(), set: jest.fn(), remove: jest.fn() } }
	}
}));
jest.mock('../../../../api/services', () => ({
	authService: { userGuestAuth: jest.fn() },
	storageService: jest.requireActual('../../../../api/services/storage.service').storageService
}));

let values: Record<string, any>;
beforeEach(() => {
	values = {};
	Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
	Object.defineProperty(globalThis, 'TextEncoder', { value: TextEncoder, configurable: true });
	(browser.storage.local.get as jest.Mock).mockImplementation(async (keys: string | string[]) =>
		Object.fromEntries((Array.isArray(keys) ? keys : [keys]).map((key) => [key, values[key]]))
	);
	(browser.storage.local.set as jest.Mock).mockImplementation(async (data: object) => {
		Object.assign(values, data);
	});
	(browser.storage.local.remove as jest.Mock).mockImplementation(async (keys: string | string[]) => {
		(Array.isArray(keys) ? keys : [keys]).forEach((key) => delete values[key]);
	});
});

test.each(['login', 'logout'])('a delayed guest authentication cannot undo a newer %s', async (change) => {
	const store = configureStore({ reducer });
	let finish!: (response: object) => void;
	(authService.userGuestAuth as jest.Mock).mockReturnValue(
		new Promise((resolve) => {
			finish = resolve;
		})
	);
	const pending = store.dispatch(userGuestAuth({}));
	if (change === 'login') {
		await storageService.setTokenToStorage('user-B');
		store.dispatch(setAuthData({ token: 'user-B', isVerified: true }));
	} else {
		await storageService.removeTokensFromStorage();
		store.dispatch(signOut());
	}
	finish({ token: 'old-guest-A' });
	await pending;
	expect(await storageService.getGuestTokenFromStorage()).toBeUndefined();
	expect(values[STORAGE_KEYS.TOKEN]).toBe(change === 'login' ? 'user-B' : undefined);
	expect(store.getState().auth.data?.token).toBe(change === 'login' ? 'user-B' : undefined);
});

test('current guest authentication still persists and updates state', async () => {
	const store = configureStore({ reducer });
	(authService.userGuestAuth as jest.Mock).mockResolvedValue({ token: 'current-guest' });
	await store.dispatch(userGuestAuth({}));
	expect(values[STORAGE_KEYS.GUEST_TOKEN]).toBe('current-guest');
	expect(store.getState().auth.data.token).toBe('current-guest');
});

test('logout during a guest persistence read cannot restore the guest on the next auth read', async () => {
	const store = configureStore({ reducer });
	(authService.userGuestAuth as jest.Mock).mockResolvedValue({ token: 'old-guest' });
	const ordinaryGet = (browser.storage.local.get as jest.Mock).getMockImplementation()!;
	let signalRead!: () => void;
	let releaseRead!: (data: object) => void;
	const reachedRead = new Promise<void>((resolve) => {
		signalRead = resolve;
	});
	let tokenReads = 0;
	(browser.storage.local.get as jest.Mock).mockImplementation((keys: string | string[]) => {
		if (keys === STORAGE_KEYS.TOKEN && ++tokenReads === 2) {
			signalRead();
			return new Promise((resolve) => {
				releaseRead = resolve;
			});
		}
		return ordinaryGet(keys);
	});
	const authenticating = store.dispatch(userGuestAuth({}));
	await reachedRead;
	const loggingOut = storageService.removeTokensFromStorage();
	store.dispatch(signOut());
	releaseRead({ [STORAGE_KEYS.TOKEN]: undefined });
	await Promise.all([authenticating, loggingOut]);
	await store.dispatch(getUserAuthInfo());
	expect(await storageService.getGuestTokenFromStorage()).toBeUndefined();
	expect(store.getState().auth.data?.token).toBeUndefined();
});

import { STORAGE_KEYS } from '../../common/constants/app-keys.const';

export class LocalStorageService {
	public setWebTokenToStorage(token: string) {
		localStorage.setItem(STORAGE_KEYS.TOKEN, token);
		return token;
	}

	public getWebTokenFromStorage() {
		return localStorage.getItem(STORAGE_KEYS.TOKEN);
	}

	public setWebGuestTokenToStorage(token: string) {
		localStorage.setItem(STORAGE_KEYS.GUEST_TOKEN, token);
		return token;
	}

	public getWebGuestTokenFromStorage() {
		return localStorage.getItem(STORAGE_KEYS.GUEST_TOKEN);
	}

	public removeTokenFromStorage() {
		localStorage.removeItem(STORAGE_KEYS.TOKEN);
		localStorage.removeItem(STORAGE_KEYS.GUEST_TOKEN);
	}

	public setAuthRedirectUrlFromStorage(url: string) {
		localStorage.setItem(STORAGE_KEYS.AUTH_REDIRECT_URL, url);
	}
}

export const localStorageService = new LocalStorageService();

import { STORAGE_KEYS } from '../../common/constants/app-keys.const';
import { browser } from '../../browser-service';
import { INighthawkResponse, ITrustedList } from '../../popup/pages/trusted-list-page/trusted-list.types';

const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export class StorageService {
	public setTokenToStorage(token: string) {
		browser.storage.local.set({ [STORAGE_KEYS.TOKEN]: token });
	}

	public async getTokenFromStorage() {
		const token = await browser.storage.local.get(STORAGE_KEYS.TOKEN);
		return token[STORAGE_KEYS.TOKEN];
	}

	public setGuestTokenToStorage(token: string) {
		browser.storage.local.set({ [STORAGE_KEYS.GUEST_TOKEN]: token });
	}

	public async getGuestTokenFromStorage() {
		const token = await browser.storage.local.get(STORAGE_KEYS.GUEST_TOKEN);
		return token[STORAGE_KEYS.GUEST_TOKEN];
	}

	public removeTokensFromStorage() {
		browser.storage.local.remove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.GUEST_TOKEN]);
	}

	public setPointsToStorage(points: string) {
		browser.storage.local.set({ [STORAGE_KEYS.GUARDIAN_POINTS]: points });
	}

	public async getPointsFromStorage() {
		const data = await browser.storage.local.get(STORAGE_KEYS.GUARDIAN_POINTS);
		return data[STORAGE_KEYS.GUARDIAN_POINTS];
	}

	public removePointsFromStorage() {
		browser.storage.local.remove(STORAGE_KEYS.GUARDIAN_POINTS);
	}

	public async getNighthawkListFromStorage() {
		const data = await browser.storage.local.get(STORAGE_KEYS.NIGHTHAWK_LIST);
		const nighthawkCacheTime = await browser.storage.local.get(STORAGE_KEYS.NH_CACHE_TIME);
		const cacheTime = nighthawkCacheTime[STORAGE_KEYS.NH_CACHE_TIME];
		if (cacheTime && Date.now() - cacheTime > CACHE_TIME) {
			return null;
		}

		return data[STORAGE_KEYS.NIGHTHAWK_LIST];
	}

	public setNighthawkListToStorage(list: INighthawkResponse) {
		browser.storage.local.set({ [STORAGE_KEYS.NIGHTHAWK_LIST]: list, [STORAGE_KEYS.NH_CACHE_TIME]: Date.now() });
	}
}

export const storageService = new StorageService();

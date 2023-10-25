import { STORAGE_KEYS } from '../../common/constants/app-keys.const';
import { browser } from '../../browser-service';
import { INighthawkResponse, ITrustedList } from '../../popup/pages/trusted-list-page/trusted-list.types';
import { CACHE_TIME } from '../utils/validate-url';
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

	public async removeTokensFromStorage() {
		await browser.storage.local.remove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.GUEST_TOKEN]);
	}

	public setPointsToStorage(points: string) {
		browser.storage.local.set({ [STORAGE_KEYS.GUARDIAN_POINTS]: points });
	}

	public async getPointsFromStorage() {
		const data = await browser.storage.local.get(STORAGE_KEYS.GUARDIAN_POINTS);
		return data[STORAGE_KEYS.GUARDIAN_POINTS];
	}

	public async removePointsFromStorage() {
		await browser.storage.local.remove(STORAGE_KEYS.GUARDIAN_POINTS);
	}

	public async getNighthawkListFromStorage() {
		const data = await browser.storage.local.get(STORAGE_KEYS.NIGHTHAWK_LIST);

		return data[STORAGE_KEYS.NIGHTHAWK_LIST];
	}

	public setNighthawkListToStorage(list: INighthawkResponse) {
		browser.storage.local.set({ [STORAGE_KEYS.NIGHTHAWK_LIST]: list });
	}
	public async removeNighthawkLists() {
		await browser.storage.local.remove(STORAGE_KEYS.NIGHTHAWK_LIST);
	}
	public async getDangerAgreeListFromStorage() {
		const data = await browser.storage.local.get(STORAGE_KEYS.DANGER_AGREE_LIST);
		return data[STORAGE_KEYS.DANGER_AGREE_LIST];
	}

	public setDangerAgreeListToStorage(url: string) {
		this.getDangerAgreeListFromStorage().then((list) => {
			const newList = list ? [...list, url] : [url];
			browser.storage.local.set({ [STORAGE_KEYS.DANGER_AGREE_LIST]: Array.from(new Set(newList)) });
		});
	}

	public async getTrustedListFromStorage() {
		const data = await browser.storage.local.get(STORAGE_KEYS.TRUSTED_LIST);
		return data[STORAGE_KEYS.TRUSTED_LIST];
	}

	public setTrustedListToStorage(list: ITrustedList[]) {
		browser.storage.local.set({ [STORAGE_KEYS.TRUSTED_LIST]: list });
	}

	public async removeTrustedListFromStorage() {
		await browser.storage.local.remove(STORAGE_KEYS.TRUSTED_LIST);
	}
}

export const storageService = new StorageService();

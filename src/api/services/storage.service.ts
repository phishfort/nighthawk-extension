import { STORAGE_KEYS } from '../../common/constants/app-keys.const';
import { browser } from '../../browser-service';
import { INighthawkResponse, ITrustedList } from '../../popup/pages/trusted-list-page/trusted-list.types';
import { IFlaggedSite } from '../../rule-engine/types';

interface TrustedListCache {
	owner: string;
	items: ITrustedList[];
}

let tokenMutations = Promise.resolve();

function mutateTokens<T>(operation: () => Promise<T>): Promise<T> {
	// Popup and background writers share an origin lock in supported browsers.
	// The queue also serializes local writers in older runtimes and unit tests.
	if (typeof navigator !== 'undefined' && navigator.locks?.request) {
		return navigator.locks.request('nighthawk-account-tokens', operation);
	}
	const pending = tokenMutations.then(operation);
	tokenMutations = pending.then(
		() => undefined,
		() => undefined
	);
	return pending;
}

// Bind personal caches to a token without persisting another usable bearer token.
async function cacheOwner(token: string): Promise<string> {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function normalizeBypassUrl(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	try {
		const url = new URL(value);
		return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
	} catch {
		return null;
	}
}

export class StorageService {
	public async setTokenToStorage(token: string) {
		if (typeof token !== 'string' || !token.trim()) return;
		return mutateTokens(async () => {
			const owner = await cacheOwner(token);
			if ((await this.getTokenFromStorage()) !== token) await this.removeTrustedListFromStorage();
			await browser.storage.local.set({
				[STORAGE_KEYS.TOKEN]: token,
				[STORAGE_KEYS.TOKEN_OWNER]: owner,
				[STORAGE_KEYS.GUEST_TOKEN]: null
			});
		});
	}

	public async getTokenFromStorage() {
		const token = await browser.storage.local.get(STORAGE_KEYS.TOKEN);
		const value = token[STORAGE_KEYS.TOKEN];
		return typeof value === 'string' && value.trim() ? value : undefined;
	}

	public async setGuestTokenToStorage(token: string, isCurrent: () => boolean = () => true) {
		if (typeof token !== 'string' || !token.trim()) return false;
		return mutateTokens(async () => {
			// Logout may invalidate this request during either awaited storage operation.
			if ((await this.getTokenFromStorage()) || !isCurrent()) return false;
			await browser.storage.local.set({ [STORAGE_KEYS.GUEST_TOKEN]: token });
			if ((await this.getTokenFromStorage()) || !isCurrent()) {
				if ((await this.getGuestTokenFromStorage()) === token)
					await browser.storage.local.remove(STORAGE_KEYS.GUEST_TOKEN);
				return false;
			}
			return true;
		});
	}

	public async getGuestTokenFromStorage() {
		const token = await browser.storage.local.get(STORAGE_KEYS.GUEST_TOKEN);
		const value = token[STORAGE_KEYS.GUEST_TOKEN];
		return typeof value === 'string' && value.trim() ? value : undefined;
	}

	public async removeTokensFromStorage() {
		return mutateTokens(async () =>
			browser.storage.local.remove([
				STORAGE_KEYS.TOKEN,
				STORAGE_KEYS.TOKEN_OWNER,
				STORAGE_KEYS.GUEST_TOKEN,
				STORAGE_KEYS.TRUSTED_LIST
			])
		);
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
		return browser.storage.local.set({ [STORAGE_KEYS.NIGHTHAWK_LIST]: list });
	}
	public async removeNighthawkLists() {
		await browser.storage.local.remove(STORAGE_KEYS.NIGHTHAWK_LIST);
	}
	public async getDangerAgreeListFromStorage() {
		const data = await browser.storage.local.get(STORAGE_KEYS.DANGER_AGREE_LIST);
		const raw = data[STORAGE_KEYS.DANGER_AGREE_LIST];
		// Legacy or poisoned storage must never throw before a phishing check runs.
		const list = Array.isArray(raw) ? raw : [];
		return Array.from(new Set(list.map(normalizeBypassUrl).filter((url): url is string => url !== null)));
	}

	public async setDangerAgreeListToStorage(value: unknown) {
		const url = normalizeBypassUrl(value);
		if (!url) return;
		const list = await this.getDangerAgreeListFromStorage();
		await browser.storage.local.set({ [STORAGE_KEYS.DANGER_AGREE_LIST]: Array.from(new Set([...list, url])) });
	}

	public async isDangerUrlAgreed(value: unknown) {
		const url = normalizeBypassUrl(value);
		return !!url && (await this.getDangerAgreeListFromStorage()).includes(url);
	}

	public async getTrustedListFromStorage(): Promise<ITrustedList[] | undefined> {
		const data = await browser.storage.local.get([
			STORAGE_KEYS.TOKEN,
			STORAGE_KEYS.TOKEN_OWNER,
			STORAGE_KEYS.TRUSTED_LIST
		]);
		const token = data[STORAGE_KEYS.TOKEN];
		const owner = data[STORAGE_KEYS.TOKEN_OWNER];
		const cache: TrustedListCache | undefined = data[STORAGE_KEYS.TRUSTED_LIST];
		// Old unowned arrays cannot safely be attributed to the current account.
		// Read paths also run in HTTP content scripts, where crypto.subtle is unavailable.
		if (
			typeof token !== 'string' ||
			!token ||
			typeof owner !== 'string' ||
			!owner ||
			!cache ||
			!Array.isArray(cache.items)
		)
			return;
		if (cache.owner !== owner) return;
		return cache.items;
	}

	public async setTrustedListToStorage(list: ITrustedList[], expectedToken: string) {
		if (!Array.isArray(list) || !expectedToken) return;
		const identity = await browser.storage.local.get([STORAGE_KEYS.TOKEN, STORAGE_KEYS.TOKEN_OWNER]);
		const owner = identity[STORAGE_KEYS.TOKEN_OWNER];
		if (identity[STORAGE_KEYS.TOKEN] !== expectedToken || typeof owner !== 'string' || !owner) return;
		await browser.storage.local.set({ [STORAGE_KEYS.TRUSTED_LIST]: { owner, items: list } });
		if ((await this.getTokenFromStorage()) !== expectedToken) {
			const data = await browser.storage.local.get(STORAGE_KEYS.TRUSTED_LIST);
			if (data[STORAGE_KEYS.TRUSTED_LIST]?.owner === owner) await this.removeTrustedListFromStorage();
		}
	}

	public async removeTrustedListFromStorage() {
		await browser.storage.local.remove(STORAGE_KEYS.TRUSTED_LIST);
	}

	public async getRulesFromStorage() {
		const data = await browser.storage.local.get(STORAGE_KEYS.RULES_LIST);
		return data[STORAGE_KEYS.RULES_LIST];
	}

	public setRulesToStorage(rules: any) {
		browser.storage.local.set({ [STORAGE_KEYS.RULES_LIST]: rules });
	}

	public async removeRulesFromStorage() {
		await browser.storage.local.remove(STORAGE_KEYS.RULES_LIST);
	}

	public async getFlaggedListFromStorage() {
		const data = await browser.storage.local.get(STORAGE_KEYS.FLAGGED_SITES_LIST);
		return data[STORAGE_KEYS.FLAGGED_SITES_LIST];
	}

	public setFlaggedListToStorage(flaggedSites: IFlaggedSite) {
		this.getFlaggedListFromStorage().then((list: IFlaggedSite[]) => {
			const updatedFlaggedList = list?.length ? [...list, flaggedSites] : [flaggedSites];
			browser.storage.local.set({ [STORAGE_KEYS.FLAGGED_SITES_LIST]: updatedFlaggedList });
		});
	}

	public async removeFlaggedListFromStorage() {
		await browser.storage.local.remove(STORAGE_KEYS.FLAGGED_SITES_LIST);
	}
}

export const storageService = new StorageService();

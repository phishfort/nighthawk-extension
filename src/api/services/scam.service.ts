import { EnhancedWithAuthHttpService } from './http-auth.service';
import { IReportScam, Iuuid } from '../types/scam.types';
import { HttpFactoryService } from './http-factory.service';
import { ECheckDataType, EType, EWebStatus, ICheckScamResponse } from '../types';
import { storageService } from './storage.service';
import { HttpService } from './http.service';
import { ITrustedList } from '../../popup/pages/trusted-list-page/trusted-list.types';
import { matchesListEntry } from '../utils/validate-url';
import { browser } from '../../browser-service';
import { IFlaggedSite, Website } from '../../rule-engine/types';
import RuleEngine from '../../rule-engine';

const CHECK_LIST_TYPES: Record<ECheckDataType, EType> = {
	[ECheckDataType.GOOGLE]: EType.WEBSITE,
	[ECheckDataType.TWITTER]: EType.TWITTER,
	[ECheckDataType.FACEBOOK]: EType.FACEBOOK,
	[ECheckDataType.YOUTUBE]: EType.YOUTUBE,
	[ECheckDataType.LINKEDIN]: EType.LINKEDIN,
	[ECheckDataType.X]: EType.X
};

type UrlLists = Partial<Record<EType, string[]>>;

interface LoadedLists {
	nighthawkList?: { blacklist?: UrlLists; trustlist?: UrlLists };
	trustedList?: ITrustedList[];
}

function requestLists(): Promise<LoadedLists | undefined> {
	return new Promise((resolve) => {
		try {
			browser.runtime.sendMessage({ action: 'loadLists' }, (response: LoadedLists | undefined) => {
				resolve(browser.runtime.lastError ? undefined : response);
			});
		} catch (error) {
			resolve(undefined);
		}
	});
}

function matchesLists(lists: UrlLists | undefined, url: string, type?: EType): boolean {
	return Object.entries(lists || {}).some(([key, entries]) =>
		Array.isArray(entries) && entries.some((entry) => typeof entry === 'string' && matchesListEntry(entry, key as EType, url, type))
	);
}

class ScamReportService {
	constructor(private authHttpService: EnhancedWithAuthHttpService, private httpService: HttpService) { }

	async addScamReport(data: IReportScam) {
		return this.authHttpService.post<Iuuid, IReportScam>('user/report-list', data);
	}

	async addScamReportGuest(data: IReportScam) {
		return this.authHttpService.post<Iuuid, IReportScam>('user/report-list/guest', data);
	}

	async checkScamFromRuleEngine(website?: Website, url?: string): Promise<ICheckScamResponse | null | void> {
		// check if url is in flagged list
		const flaggedSites = await storageService.getFlaggedListFromStorage();
		const isAlreadyFlagged = flaggedSites?.length ? flaggedSites?.some((site: IFlaggedSite) => site.url === url) : false;
		if (isAlreadyFlagged) {
			return { status: EWebStatus.DANGEROUS };
		}

		const ruleEngine = new RuleEngine();
		const result = await ruleEngine.checkWebsite(website);
		// add to flagged list if flagged
		if (result.status === "flagged") {
			storageService.setFlaggedListToStorage({
				url: url,
				name: result.matchedRule?.name,
				ruleId: result.matchedRule?.ruleId
			});
			return { status: EWebStatus.DANGEROUS };
		}

		return { status: EWebStatus.UNKNOWN }
	}

	async checkScam(data: { url: string; type?: ECheckDataType, requestFrom?: string, website?: Website }): Promise<ICheckScamResponse | null | void> {
		if (data?.requestFrom === "ruleEngine" && data?.website) {
			const response = await this.checkScamFromRuleEngine(data?.website, data?.url);
			return response;
		}

		const type = data.type ? CHECK_LIST_TYPES[data.type] : undefined;
		if (data.type && !type) return { status: EWebStatus.UNKNOWN };

		const token = await storageService.getTokenFromStorage();
		let nighthawkList = await storageService.getNighthawkListFromStorage();
		let trustedList = token ? await storageService.getTrustedListFromStorage() : undefined;
		if (!nighthawkList || (token && !trustedList)) {
			// The current check must await a cold-cache fetch before using its lists.
			const loaded = await requestLists();
			if (!nighthawkList) nighthawkList = loaded?.nighthawkList;
			if (token && !trustedList && Array.isArray(loaded?.trustedList)) trustedList = loaded?.trustedList;
		}

		const isDangerous = matchesLists(nighthawkList?.blacklist, data.url, type);
		let isSafe = matchesLists(nighthawkList?.trustlist, data.url, type);
		// A login/logout during cache reads or a list request invalidates personal trust.
		if (token && (await storageService.getTokenFromStorage()) === token &&
			trustedList?.some((item: ITrustedList) => matchesListEntry(item.url, item.type, data.url, type))) {
			isSafe = true;
		}

		if (isDangerous) return { status: EWebStatus.DANGEROUS };
		if (isSafe) return { status: EWebStatus.SAFE };
		return { status: EWebStatus.UNKNOWN };
	}
}

const factory = new HttpFactoryService();
export const scamReportService = new ScamReportService(factory.createAuthHttpService(), factory.createHttpService());

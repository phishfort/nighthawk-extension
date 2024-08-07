import { EnhancedWithAuthHttpService } from './http-auth.service';
import { IReportScam, Iuuid } from '../types/scam.types';
import { HttpFactoryService } from './http-factory.service';
import { ECheckDataType, EType, EWebStatus, ICheckScamResponse } from '../types';
import { storageService } from './storage.service';
import { HttpService } from './http.service';
import { ITrustedList } from '../../popup/pages/trusted-list-page/trusted-list.types';
import { getValidUrl } from '../utils/validate-url';
import { browser } from '../../browser-service';
import { SOC_MEDIA_TYPES } from '../../common/constants/app-keys.const';
import { IFlaggedSite, Website } from '../../rule-engine/types';
import RuleEngine from '../../rule-engine';

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
		if (Object.values(SOC_MEDIA_TYPES).some((el) => getValidUrl(el) === getValidUrl(data.url))) {
			return {
				status: EWebStatus.SAFE
			};
		}

		if (data?.requestFrom === "ruleEngine" && data?.website) {
			const response = await this.checkScamFromRuleEngine(data?.website, data?.url);
			return response;
		}

		// check if url is in nighthawk list
		let nighthawkList = await storageService.getNighthawkListFromStorage();
		if (!nighthawkList) {
			browser.runtime.sendMessage({ action: 'loadLists' }, (response) => {
				if (response?.nighthawkList) {
					nighthawkList = response?.nighthawkList;
				}
			});
		}

		let isDangerous = false;
		let isSafe = false;

		// search in type only
		if (data.type) {
			let key = '';
			Object.keys(nighthawkList?.blacklist).forEach((item: any) => {
				if (data.type === ECheckDataType.GOOGLE) {
					key = EType.WEBSITE;
				} else if (data.type?.toLowerCase().includes(item.toLowerCase())) {
					key = item;
				}
			});

			if (key) {
				nighthawkList?.blacklist[key].forEach((url: any) => {
					const nighthawkUrl = getValidUrl(url);
					const item = nighthawkUrl && nighthawkUrl.toLowerCase() === getValidUrl(data.url).toLowerCase();
					if (item) {
						isDangerous = true;
						return;
					}
				});

				nighthawkList?.trustlist[key].forEach((url: any) => {
					const nighthawkUrl = getValidUrl(url);
					const item = nighthawkUrl && nighthawkUrl.toLowerCase() === getValidUrl(data.url).toLowerCase();
					if (item) {
						isSafe = true;
						return;
					}
				});
			}
		} else {
			Object.entries(nighthawkList?.blacklist).forEach(([key, value]: any) => {
				value.forEach((url: any) => {
					const nighthawkUrl = getValidUrl(url);
					const item = nighthawkUrl && nighthawkUrl.toLowerCase() === getValidUrl(data.url).toLowerCase();
					if (item) {
						isDangerous = true;
						return;
					}
				});
			});

			Object.entries(nighthawkList?.trustlist).forEach(([key, value]: any) => {
				value.forEach((url: any) => {
					const nighthawkUrl = getValidUrl(url);
					const item = nighthawkUrl && nighthawkUrl.toLowerCase() === getValidUrl(data.url).toLowerCase();
					if (item) {
						isSafe = true;
						return;
					}
				});
			});
		}

		const token = await storageService.getTokenFromStorage();
		if (token) {
			let trustedList = await storageService.getTrustedListFromStorage();
			if (!trustedList) {
				browser.runtime.sendMessage({ action: 'loadLists' }, (response) => {
					if (response?.trustedList) {
						trustedList = response?.trustedList;
					}
				});
			}

			trustedList?.forEach((tl: ITrustedList) => {
				const trustedListUrl = getValidUrl(tl.url);
				const item = trustedListUrl && trustedListUrl.toLowerCase() === getValidUrl(data.url).toLowerCase();
				if (item) {
					isSafe = true;
					return;
				}
			});
		}

		if (isDangerous) return { status: EWebStatus.DANGEROUS };
		if (isSafe) return { status: EWebStatus.SAFE };
		return { status: EWebStatus.UNKNOWN };
	}
}

const factory = new HttpFactoryService();
export const scamReportService = new ScamReportService(factory.createAuthHttpService(), factory.createHttpService());

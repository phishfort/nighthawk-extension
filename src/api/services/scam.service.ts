import { EnhancedWithAuthHttpService } from './http-auth.service';
import { IReportScam, Iuuid } from '../types/scam.types';
import { HttpFactoryService } from './http-factory.service';
import { EWebStatus, ICheckScamResponse } from '../types';
import { storageService } from './storage.service';
import { HttpService } from './http.service';
import axios from 'axios';
import { INighthawkResponse, ITrustedList } from '../../popup/pages/trusted-list-page/trusted-list.types';
import { getValidUrl } from '../utils/validate-url';
import { trustedListService } from './trusted-list.service';

const CDN_URL = process.env.REACT_APP_CDN_URL!;

class ScamReportService {
	constructor(private authHttpService: EnhancedWithAuthHttpService, private httpService: HttpService) {}

	async addScamReport(data: IReportScam) {
		return this.authHttpService.post<Iuuid, IReportScam>('user/report-list', data);
	}

	async addScamReportGuest(data: IReportScam) {
		return this.authHttpService.post<Iuuid, IReportScam>('user/report-list/guest', data);
	}

	async checkScam(data: { url: string }): Promise<ICheckScamResponse | null | void> {
		// check if url is in nighthawk list
		let nighthawkList = await storageService.getNighthawkListFromStorage();
		if (!nighthawkList) {
			const resp = await axios.get<INighthawkResponse>(CDN_URL);
			nighthawkList = resp.data;
			storageService.setNighthawkListToStorage(nighthawkList);
		}

		let isDangerous = false;
		let isSafe = false;

		Object.entries(nighthawkList.blacklist).forEach(([key, value]: any) => {
			value.forEach((url: any) => {
				const nighthawkUrl = getValidUrl(url);
				const item = nighthawkUrl && nighthawkUrl.toLowerCase() === getValidUrl(data.url).toLowerCase();
				if (item) isDangerous = true;
			});
		});

		Object.entries(nighthawkList.trustlist).forEach(([key, value]: any) => {
			value.forEach((url: any) => {
				const nighthawkUrl = getValidUrl(url);
				const item = nighthawkUrl && nighthawkUrl.toLowerCase() === getValidUrl(data.url).toLowerCase();
				if (item) isSafe = true;
			});
		});

		if (isDangerous) return { status: EWebStatus.DANGEROUS };
		if (isSafe) return { status: EWebStatus.SAFE };

		// check if url is in personal trusted list
		// TODO: find a way to cache personal trusted list
		const token = await storageService.getTokenFromStorage();
		if (token) {
			let personalTrustedList = await trustedListService.getAllTrustedList();
			if (personalTrustedList) {
				const item = personalTrustedList.find(
					(item: ITrustedList) =>
						item.url && getValidUrl(item.url).toLowerCase() === getValidUrl(data.url).toLowerCase()
				);
				if (item) return { status: EWebStatus.SAFE };
			}
		}

		return { status: EWebStatus.UNKNOWN };
	}
}

const factory = new HttpFactoryService();
export const scamReportService = new ScamReportService(factory.createAuthHttpService(), factory.createHttpService());

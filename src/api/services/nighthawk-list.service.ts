import { EnhancedWithAuthHttpService } from './http-auth.service';
import { HttpFactoryService } from './http-factory.service';
import { INighthawkList } from '../../popup/pages/trusted-list-page/trusted-list.types';
import { EType } from '../types';
import axios from 'axios';
class NighthawkListService {
	constructor(private httpService: EnhancedWithAuthHttpService) {}

	async getNighthawkWhiteList(type?: EType) {
		const queryString = type ? `?type=${type}` : '';
		const response = await axios.get(process.env.REACT_APP_CDN_URL + queryString, {
			headers: {
				'x-api-key': process.env.REACT_APP_NIGHTHAWK_API_KEY!
			}
		});
		let data: INighthawkList[] = [];

		// format trustlist data as INighthawkList[]
		Object.entries(response.data.trustlist).forEach(([key, value]: any) => {
			value.forEach((item: any) =>
				data.push({
					type: key as EType,
					url: item
				})
			);
		});

		return data;
	}

	async getNighthawkGreyList() {
		return this.httpService.get<string[]>(`user/greylist`);
	}

	async getNighthawkBlackList(type?: EType) {
		const queryString = type ? `?type=${type}` : '';
		const response = await axios.get(process.env.REACT_APP_CDN_URL + queryString, {
			headers: {
				'x-api-key': process.env.REACT_APP_NIGHTHAWK_API_KEY!
			}
		});
		let data: INighthawkList[] = [];

		// format blacklist data as INighthawkList[]
		Object.entries(response.data.blacklist).forEach(([key, value]: any) => {
			value.forEach((item: any) =>
				data.push({
					type: key as EType,
					url: item
				})
			);
		});

		return data;
	}
}

const factory = new HttpFactoryService();
export const nighthawkListService = new NighthawkListService(factory.createAuthHttpService());

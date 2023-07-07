import { HttpService } from './http.service';
import { IHttpClient, IHttpConfig, IMap } from '../types';
import { storageService } from './storage.service';

export class EnhancedWithAuthHttpService implements IHttpClient {
	constructor(private httpService: HttpService) {}

	public createQueryLink(base: string, parameters: IMap) {
		return this.httpService.createQueryLink(base, parameters);
	}

	public async get<R>(url: string, config: IHttpConfig = {}): Promise<R | void> {
		return this.httpService.get<R>(url, await this.attachAuthHeader(config));
	}

	public async post<R, D>(url: string, data: D, config: IHttpConfig = {}): Promise<R | void> {
		return this.httpService.post<R, D>(url, data, await this.attachAuthHeader(config));
	}

	public async put<R, D>(url: string, data: D, config: IHttpConfig = {}): Promise<R | void> {
		return this.httpService.put<R, D>(url, data, await this.attachAuthHeader(config));
	}

	public async delete<R>(url: string, config: IHttpConfig = {}): Promise<R | void> {
		return this.httpService.delete<R>(url, await this.attachAuthHeader(config));
	}

	private async attachAuthHeader(config: IHttpConfig): Promise<IHttpConfig> {
		const token = await this.populateTokenToHeaderConfig();
		return {
			...config,
			headers: { ...config.headers, ...token }
		};
	}

	private async populateTokenToHeaderConfig(): Promise<object> {
		const token = (await storageService.getTokenFromStorage()) || (await storageService.getGuestTokenFromStorage());
		return {
			Authorization: `Bearer ${token}`
		};
	}
}

import { AxiosError } from 'axios';
import { STORAGE_KEYS } from '../../common/constants/app-keys.const';
import { IErrorResponse, IHttpClient, IHttpConfig, IMap, IResponse } from '../types';

export class HttpService implements IHttpClient {
	constructor(private fetchingService: IHttpClient, private baseUrl = process.env.REACT_APP_BACKEND_URL) {}

	public createQueryLink(base: string, args: IMap) {
		let url = `${base}?`;
		Object.keys(args).forEach((parameter, index) => {
			if (args[parameter]) {
				url += `${index > 0 ? '&' : ''}${parameter}=${args[parameter]}`;
			}
		});
		return url;
	}

	public async get<T>(url: string, config?: IHttpConfig) {
		return this.fetchingService
			.get<IResponse<T>>(this.getFullApiUrl(url), {
				...config,
				headers: {
					...config?.headers,
					...this.populateContentTypeHeaderConfig()
				}
			})
			.then((result) => {
				if (result) {
					this.checkResponseStatus(result);
					return result.data;
				}
			})
			.catch(this.errorHandler);
	}

	public async post<T, D>(url: string, data: D, config?: IHttpConfig) {
		return this.fetchingService
			.post<IResponse<T>, D>(this.getFullApiUrl(url), data, {
				...config,
				headers: {
					...config?.headers,
					...this.populateContentTypeHeaderConfig()
				}
			})
			.then((result) => {
				if (result) {
					this.checkResponseStatus(result);
					return result.data;
				}
			})
			.catch(this.errorHandler);
	}

	public put<T, D>(url: string, data: D, config?: IHttpConfig) {
		return this.fetchingService
			.put<IResponse<T>, D>(this.getFullApiUrl(url), data, config)
			.then((result) => {
				if (result) {
					this.checkResponseStatus(result);
					return result.data;
				}
			})
			.catch(this.errorHandler);
	}

	public delete<T>(url: string, config?: IHttpConfig) {
		return this.fetchingService
			.delete<IResponse<T>>(this.getFullApiUrl(url), config)
			.then((result) => {
				if (result) {
					this.checkResponseStatus(result);
					return result.data;
				}
			})
			.catch(this.errorHandler);
	}

	public populateContentTypeHeaderConfig() {
		return {
			'Content-Type': 'application/json'
		};
	}

	private getFullApiUrl(url: string) {
		return `${this.baseUrl}/${url}`;
	}

	private errorHandler(error: AxiosError<IErrorResponse>) {
		const errorResponse = error.response;

		const errorData: IErrorResponse = {
			statusCode: errorResponse?.data.statusCode || 404,
			message: errorResponse?.data.message || 'Oops, something went wrong!'
		};

		const event = new CustomEvent('http-error', { detail: errorData });
		document.dispatchEvent(event);

		throw error;
	}

	private checkResponseStatus<T>(result: IResponse<T>) {
		if (result.status >= 400 && result.status < 600) {
			const errorData = {
				response: {
					status: result.status,
					data: result.data
				}
			};

			throw new Error(JSON.stringify(errorData));
		}
	}
}

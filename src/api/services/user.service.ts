import { HttpService } from './http.service';
import { EnhancedWithAuthHttpService } from './http-auth.service';
import { IAuthResponse } from '../types';
import { HttpFactoryService } from './http-factory.service';

export class UserService {
	constructor(private httpService: HttpService) {}

	async userGuestAuth(): Promise<IAuthResponse | null | void> {
		return this.httpService.post('user-auth/sign-in/guest', {});
	}
}

const factory = new HttpFactoryService();
export const authService = new UserService(factory.createHttpService());

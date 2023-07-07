import { IUserInfo, Iuuid } from '../types/profile.types';
import { HttpFactoryService } from './http-factory.service';
import { EnhancedWithAuthHttpService } from './http-auth.service';

class ProfileService {
	constructor(private httpService: EnhancedWithAuthHttpService) {}

	async getUserInfo() {
		return this.httpService.get<IUserInfo>('user/info');
	}

	async updateUserProfile(data: IUserInfo) {
		return this.httpService.put<Iuuid, IUserInfo>('user/update', data);
	}
}

const factory = new HttpFactoryService();
export const profileService = new ProfileService(factory.createAuthHttpService());

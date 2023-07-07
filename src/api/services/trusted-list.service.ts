import { EnhancedWithAuthHttpService } from './http-auth.service';
import { Iuuid } from '../types/scam.types';
import { HttpFactoryService } from './http-factory.service';
import { ICreateTrustedItem, ITrustedList } from '../../popup/pages/trusted-list-page/trusted-list.types';

class TrustedListService {
	constructor(private httpService: EnhancedWithAuthHttpService) {}

	async getAllTrustedList() {
		return this.httpService.get<ITrustedList[]>('user/my-trusted');
	}

	async addNewTrustedItem(data: ICreateTrustedItem) {
		return this.httpService.post<Iuuid, ICreateTrustedItem>('user/trust-list', data);
	}

	async removeTrustedItem({ id }: Iuuid): Promise<Iuuid | void> {
		return this.httpService.delete<Iuuid>(`user/remove/${id}`);
	}
}

const factory = new HttpFactoryService();
export const trustedListService = new TrustedListService(factory.createAuthHttpService());

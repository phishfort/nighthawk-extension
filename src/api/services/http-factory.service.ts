import axios from 'axios';
import { EnhancedWithAuthHttpService } from './http-auth.service';
import { HttpService } from './http.service';

export class HttpFactoryService {
	createHttpService(): HttpService {
		return new HttpService(axios);
	}

	createAuthHttpService() {
		return new EnhancedWithAuthHttpService(this.createHttpService());
	}
}

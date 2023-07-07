import { EType } from '../../../api/types';

export interface ITrustedList {
	id: string;
	url: string;
	createdAt: Date;
	type: EType;
	owner: string;
}

export interface Iuuid {
	id: string;
}

export interface ICreateTrustedItem {
	url: string;
	type: EType;
	label?: string;
	comment?: string;
}

export interface INighthawkList {
	type: EType;
	url: string;
}

export interface INighthawkResponse {
	trustlist: INighthawkList;
	blacklist: INighthawkList;
}

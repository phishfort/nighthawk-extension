import { EType } from './index';

export interface IReportScam {
	url: string;
	type: EType;
	label?: string;
	comment?: string;
	impersonatedUrl?: string;
	userId?: string;
	email?: string;
}

export interface Iuuid {
	id: string;
}

import { IStateWithAsync, stateWithAsync } from '../common';
import { ECheckDataType, EWebStatus, ICheckScamResponse } from '../../../../api/types';

export interface ICheckData {
	[key: string]: EWebStatus;
}

export interface IScamState extends IStateWithAsync {
	lastCheck: { [key: string]: EWebStatus };
	[ECheckDataType.YOUTUBE]: ICheckData;
	[ECheckDataType.TWITTER]: ICheckData;
	[ECheckDataType.FACEBOOK]: ICheckData;
	[ECheckDataType.LINKEDIN]: ICheckData;
	[ECheckDataType.GOOGLE]: ICheckData;
}

export const initialState: IScamState = {
	...stateWithAsync,
	lastCheck: {},
	[ECheckDataType.YOUTUBE]: {},
	[ECheckDataType.TWITTER]: {},
	[ECheckDataType.FACEBOOK]: {},
	[ECheckDataType.LINKEDIN]: {},
	[ECheckDataType.GOOGLE]: {}
};

export enum SCAM_ACTIONS_TYPES {
	ADD_SCAM = 'addScam',
	CHECK_SCAM = 'checkScam'
}

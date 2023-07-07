import { IStateWithAsync, stateWithAsync } from '../common';
import { ICreateTrustedItem, INighthawkList } from '../../../pages/trusted-list-page/trusted-list.types';

export interface ITrustedListState extends IStateWithAsync {
	addedInfo: ICreateTrustedItem | null;
	removeItemInfo: any;
	whiteList: INighthawkList[];
	greyList: string[];
	blackList: INighthawkList[];
}

export const initialState: ITrustedListState = {
	...stateWithAsync,
	addedInfo: null,
	removeItemInfo: {},
	whiteList: [],
	greyList: [],
	blackList: []
};

export enum TRUSTED_LIST_ACTIONS_TYPES {
	GET_LIST = 'getList',
	ADD_TRUSTED = 'addTrusted',
	REMOVE_TRUSTED = 'removeTrusted',
	GET_WHITE_LIST = 'getWhiteList',
	GET_GREY_LIST = 'getGreyList',
	GET_BLACK_LIST = 'getBlackList'
}

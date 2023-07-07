import { IStateWithAsync, stateWithAsync } from '../common';
import { Iuuid } from '../../../../api/types/profile.types';

export interface IUserState extends IStateWithAsync {
	updatedProfileId: Iuuid;
	guestGuardianPoints: number | null;
	routes: string[];
}

export const initialState = {
	...stateWithAsync,
	updatedProfileId: '',
	guestGuardianPoints: null,
	routes: [] as string[]
};

export enum USER_ACTIONS_TYPES {
	GET_INFO = 'getInfo',
	UPDATE_INFO = 'updateInfo'
}

export enum AUTH_ACTIONS_TYPES {
	GOOGLE = 'google',
	TWITTER = 'twitter',
	SIGN_UP_CREDENTIALS = 'signUpCredentials',
	SIGN_IN_CREDENTIALS = 'signInCredentials',
	GUEST = 'guest',
	AUTH_INFO = 'authInfo'
}

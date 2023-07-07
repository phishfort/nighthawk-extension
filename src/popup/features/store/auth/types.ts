import { IStateWithAsync, stateWithAsync } from '../common';

export interface IAuthState extends IStateWithAsync {
	shouldLogoutWeb: boolean;
	authRedirectUrl: string;
}

export enum EAuthTypes {
	SIGN_UP = 'sign-up',
	SIGN_IN = 'sign-in'
}

export const initialState: IAuthState = {
	...stateWithAsync,
	shouldLogoutWeb: false,
	authRedirectUrl: ''
};

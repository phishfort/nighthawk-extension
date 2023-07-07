import { SerializedError } from '@reduxjs/toolkit';

export const createAsyncReducer = <S, P>(successCallback?: (state: S, payload: P) => void) => {
	return {
		// @ts-ignore
		fetch: (state: S) => (state.isLoading = true),
		success:
			successCallback ||
			((state: S, { payload }: { payload: P }) => {
				// @ts-ignore
				state.isLoading = false;
				// @ts-ignore
				state.isFailed = false;
				// @ts-ignore
				state.data = payload;
			}),
		failed: (state: any) => {
			state.isLoading = false;
			state.isFailed = true;
		}
	};
};

export interface IStateWithAsync {
	isLoading: boolean;
	isFailed: boolean;
	data: any;
	error: SerializedError | string | null;
}

// Common
export const stateWithAsync = {
	isLoading: false,
	isFailed: false,
	data: null as any,
	error: null
};

// Types
export interface IRejectValue {
	error: string;
}

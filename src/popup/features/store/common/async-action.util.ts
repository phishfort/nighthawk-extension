import { AsyncThunk, SerializedError, PayloadAction } from '@reduxjs/toolkit';

export const getAsyncActionsReducer = <S, P>(
	asyncAction: AsyncThunk<any, void, Record<string, unknown>>,
	key = 'data',
	successCallback?: (state: S, payload: P) => void,
	failCallback?: (state: S, payload: P | SerializedError) => void,
	setLoading = true
) => ({
	[asyncAction.pending.type]: (state: any) => {
		if (setLoading) {
			state.isLoading = true;
		}
	},
	[asyncAction.fulfilled.type]: (state: any, action: PayloadAction<any>) => {
		state.isLoading = false;
		state[key] = action.payload;
		if (successCallback) {
			successCallback(state, action.payload);
		}
	},
	[asyncAction.rejected.type]: (state: any, error: PayloadAction<SerializedError>) => {
		state.isLoading = false;
		state.isFailed = true;
		if (error.payload?.message) {
			state.error = error.payload.message;
		}
		if (failCallback) {
			failCallback(state, error.payload);
		}
	}
});

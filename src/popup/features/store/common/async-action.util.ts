import { AsyncThunk, SerializedError, PayloadAction } from '@reduxjs/toolkit';

export const getAsyncActionsReducer = <S, P>(
	asyncAction: AsyncThunk<any, void, Record<string, unknown>>,
	key = 'data',
	successCallback?: (state: S, payload: P) => void,
	failCallback?: (state: S, payload: P | SerializedError) => void,
	setLoading = true
) => ({
	[asyncAction.pending.type]: (state: any, action: PayloadAction<unknown, string, { requestId: string }>) => {
		state.pendingRequests[action.meta.requestId] = true;
		if (setLoading) {
			state.isLoading = true;
		}
	},
	[asyncAction.fulfilled.type]: (state: any, action: PayloadAction<any, string, { requestId: string }>) => {
		// Resetting account state invalidates every request started by that account.
		if (!state.pendingRequests[action.meta.requestId]) return;
		delete state.pendingRequests[action.meta.requestId];
		state.isLoading = false;
		state[key] = action.payload;
		if (successCallback) {
			successCallback(state, action.payload);
		}
	},
	[asyncAction.rejected.type]: (state: any, error: PayloadAction<SerializedError, string, { requestId: string }>) => {
		if (!state.pendingRequests[error.meta.requestId]) return;
		delete state.pendingRequests[error.meta.requestId];
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

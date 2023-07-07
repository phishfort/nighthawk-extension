import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './types';
import { REDUCERS_NAMES } from '../../../../event/store/types';
import { getUserAuthInfo, userGuestAuth } from './actions';
import { getAsyncActionsReducer } from '../common/async-action.util';

export const authSlice = createSlice({
	name: REDUCERS_NAMES.AUTH,
	initialState,
	reducers: {
		signOut: (state) => {
			state.data = null;
			state.shouldLogoutWeb = true;
		},
		setShouldLogoutWeb: (state, { payload }) => {
			state.shouldLogoutWeb = payload;
		},
		setAuthData: (state, { payload }) => {
			state.data = payload;
		},
		setAuthRedirectUrl: (state, { payload }) => {
			state.authRedirectUrl = payload;
		}
	},
	extraReducers: {
		...getAsyncActionsReducer(userGuestAuth as any),
		...getAsyncActionsReducer(getUserAuthInfo as any)
	}
});

export const { signOut, setAuthData, setShouldLogoutWeb, setAuthRedirectUrl } = authSlice.actions;

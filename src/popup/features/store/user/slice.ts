import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './types';
import { REDUCERS_NAMES } from '../../../../event/store/types';
import { fetchUserInfo, updateUserInfo } from './actions';
import { getAsyncActionsReducer } from '../common/async-action.util';

export const userSlice = createSlice({
	name: REDUCERS_NAMES.USER,
	initialState,
	reducers: {
		clearUserInfo: (state) => {
			state.data = null;
		},
		setGuestGuardianPoints: (state, { payload }) => {
			state.guestGuardianPoints = payload;
		},
		setRoutes: (state, { payload }) => {
			const lastRoutes = [...state.routes, payload];
			state.routes = lastRoutes.length > 2 ? lastRoutes.slice(-2) : lastRoutes;
		}
	},
	extraReducers: {
		...getAsyncActionsReducer(fetchUserInfo as any),
		...getAsyncActionsReducer(updateUserInfo as any, 'updatedProfileId')
	}
});

export const { clearUserInfo, setGuestGuardianPoints, setRoutes } = userSlice.actions;

import { createSlice } from '@reduxjs/toolkit';
import { initialState, ITrustedListState } from './types';
import { REDUCERS_NAMES } from '../../../../event/store/types';
import {
	addToTrustedList,
	fetchNighthawkBlackList,
	fetchNighthawkGreyList,
	fetchNighthawkWhiteList,
	fetchTrustedList,
	removeFromTrustedList
} from './actions';
import { getAsyncActionsReducer } from '../common/async-action.util';

export const trustedListSlice = createSlice({
	name: REDUCERS_NAMES.TRUSTED_LIST,
	initialState,
	reducers: {
		clearTrustedList: (state) => {
			state.data = null;
		}
	},
	extraReducers: {
		...getAsyncActionsReducer(fetchTrustedList as any),
		...getAsyncActionsReducer(
			addToTrustedList as any,
			'addedInfo',
			(state: ITrustedListState) => {
				state.error = null;
			},
			(state: ITrustedListState, payload: any) => {
				state.addedInfo = payload.data;
			}
		),
		...getAsyncActionsReducer(removeFromTrustedList as any, 'removeItemInfo'),
		...getAsyncActionsReducer(fetchNighthawkWhiteList as any, 'whiteList', undefined, undefined, false),
		...getAsyncActionsReducer(fetchNighthawkGreyList as any, 'greyList', undefined, undefined, false),
		...getAsyncActionsReducer(fetchNighthawkBlackList as any, 'blackList', undefined, undefined, false)
	}
});

export const { clearTrustedList } = trustedListSlice.actions;

import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../event/store';
import { REDUCERS_NAMES } from '../../../../event/store/types';
import { getAsyncActionsReducer } from '../../../../popup/features/store/common/async-action.util';
import { checkSourceType } from './actions';
import { IStateWithAsync, stateWithAsync } from '../../../../popup/features/store/common';
import { EWebStatus } from '../../../../api/types';

export interface ISourceState extends IStateWithAsync {
	sourceType: EWebStatus;
	activeTab: string;
}

export const initialState: ISourceState = {
	...stateWithAsync,
	sourceType: EWebStatus.UNKNOWN,
	activeTab: ''
};

export const sourceSlice = createSlice({
	name: REDUCERS_NAMES.SOURCE,
	initialState,
	reducers: {
		setActiveTab: (state, { payload }) => {
			state.activeTab = payload;
		},
		setSourceType: (state, { payload }) => {
			state.sourceType = payload.type || EWebStatus.UNKNOWN;
			state.data = { [payload.host]: payload.type };
		}
	},
	extraReducers: {
		...getAsyncActionsReducer(
			checkSourceType as any,
			'data',
			(state: ISourceState, payload: { [key: string]: EWebStatus }) => {
				state.sourceType = Object.values(payload)[0];
			}
		)
	}
});

// selectors
export const getSourceData = (state: RootState) => state?.source?.data;
export const getSourceType = (state: RootState) => state?.source?.sourceType;
export const getActiveTab = (state: RootState) => state?.source?.activeTab;

export const { setActiveTab, setSourceType } = sourceSlice.actions;

export default sourceSlice.reducer;

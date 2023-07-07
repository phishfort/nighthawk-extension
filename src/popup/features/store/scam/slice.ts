import { createSlice } from '@reduxjs/toolkit';
import { initialState, IScamState } from './types';
import { REDUCERS_NAMES } from '../../../../event/store/types';
import { addToScam, addToScamGuest, checkScam } from './actions';
import { getAsyncActionsReducer } from '../common/async-action.util';
import { ECheckDataType, EWebStatus } from '../../../../api/types';

const MAX_CHECK_LIST_LENGTH = 30;

export const scamSlice = createSlice({
	name: REDUCERS_NAMES.SCAM,
	initialState,
	reducers: {
		clearCheckData: (state) => {
			state[ECheckDataType.YOUTUBE] = {};
			state[ECheckDataType.TWITTER] = {};
			state[ECheckDataType.FACEBOOK] = {};
			state[ECheckDataType.LINKEDIN] = {};
			state[ECheckDataType.GOOGLE] = {};
		}
	},
	extraReducers: {
		...getAsyncActionsReducer(addToScam as any),
		...getAsyncActionsReducer(addToScamGuest as any),
		...getAsyncActionsReducer(
			checkScam as any,
			'lastCheck',
			(
				state: IScamState,
				payload: {
					// @ts-ignore
					type: ECheckDataType;
					[key: string]: EWebStatus;
				}
			) => {
				const { type } = payload;
				const arr = state[type] ? Object.entries(state[type]) : [];
				const data =
					arr.length > MAX_CHECK_LIST_LENGTH
						? arr.slice(-MAX_CHECK_LIST_LENGTH).reduce(
								(acc, [key, value]) => ({
									...acc,
									[key]: value
								}),
								{}
						  )
						: state[type];
				// @ts-ignore
				state[type] = {
					...data,
					...payload
				};
			},
			undefined,
			false
		)
	}
});

export const { clearCheckData } = scamSlice.actions;

import { createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { REDUCERS_NAMES } from '../../../../event/store/types';
import { TRUSTED_LIST_ACTIONS_TYPES } from './types';
import { scamReportService, trustedListService } from '../../../../api/services';
import { ICreateTrustedItem } from '../../../pages/trusted-list-page/trusted-list.types';
import { Iuuid } from '../../../../api/types/scam.types';
import { IRejectValue } from '../common';
import { nighthawkListService } from '../../../../api/services/nighthawk-list.service';
import { EType } from '../../../../api/types';

interface ITrustedListRejectValue extends SerializedError {
	data?: any;
}

export const fetchTrustedList = createAsyncThunk(
	`${REDUCERS_NAMES.TRUSTED_LIST}/${TRUSTED_LIST_ACTIONS_TYPES.GET_LIST}`,
	async (_, { rejectWithValue }) => {
		const data = await trustedListService.getAllTrustedList();

		if (!data) {
			return rejectWithValue({ error: 'Some error' });
		}

		return data;
	}
);

export const addToTrustedList = createAsyncThunk<
	ICreateTrustedItem,
	ICreateTrustedItem,
	{ rejectValue: ITrustedListRejectValue }
>(
	`${REDUCERS_NAMES.TRUSTED_LIST}/${TRUSTED_LIST_ACTIONS_TYPES.ADD_TRUSTED}`,
	async ({ type, url, comment, label }, { rejectWithValue }) => {
		try {
			await trustedListService.addNewTrustedItem({
				type,
				url,
				comment
			});

			return { type, label, url };
		} catch (e: any) {
			return rejectWithValue({ message: e?.response?.data?.message, data: { type, label, url } });
		}
	}
);

export const removeFromTrustedList = createAsyncThunk<Iuuid, Iuuid, { rejectValue: IRejectValue }>(
	`${REDUCERS_NAMES.TRUSTED_LIST}/${TRUSTED_LIST_ACTIONS_TYPES.REMOVE_TRUSTED}`,
	async ({ id }, { rejectWithValue }) => {
		const data = await trustedListService.removeTrustedItem({ id });

		if (!data) {
			return rejectWithValue({ error: 'Some error' });
		}

		return data;
	}
);

export const fetchNighthawkWhiteList = createAsyncThunk(
	`${REDUCERS_NAMES.WHITE_LIST}/${TRUSTED_LIST_ACTIONS_TYPES.GET_WHITE_LIST}`,
	async (type: EType, { rejectWithValue }) => {
		try {
			return await nighthawkListService.getNighthawkWhiteList(type);
		} catch (e: any) {
			return rejectWithValue({ message: e?.response?.data?.message });
		}
	}
);

export const fetchNighthawkGreyList = createAsyncThunk(
	`${REDUCERS_NAMES.WHITE_LIST}/${TRUSTED_LIST_ACTIONS_TYPES.GET_GREY_LIST}`,
	async (_, { rejectWithValue }) => {
		try {
			return await nighthawkListService.getNighthawkGreyList();
		} catch (e: any) {
			return rejectWithValue({ message: e?.response?.data?.message });
		}
	}
);

export const fetchNighthawkBlackList = createAsyncThunk(
	`${REDUCERS_NAMES.WHITE_LIST}/${TRUSTED_LIST_ACTIONS_TYPES.GET_BLACK_LIST}`,
	async (type: EType, { rejectWithValue }) => {
		try {
			return await nighthawkListService.getNighthawkBlackList(type);
		} catch (e: any) {
			return rejectWithValue({ message: e?.response?.data?.message });
		}
	}
);

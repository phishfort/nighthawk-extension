import { createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { REDUCERS_NAMES } from '../../../../event/store/types';
import { SCAM_ACTIONS_TYPES } from './types';
import { scamReportService } from '../../../../api/services';
import { IReportScam } from '../../../../api/types/scam.types';
import { ECheckDataType, EWebStatus, ICheckScamResponse } from '../../../../api/types';
import { SOC_MEDIA_TYPES } from '../../../../common/constants/app-keys.const';

export interface ICheckScamRequest {
	type: ECheckDataType;
	url: string;
}

export const addToScam = createAsyncThunk<IReportScam, IReportScam, { rejectValue: SerializedError }>(
	`${REDUCERS_NAMES.SCAM}/${SCAM_ACTIONS_TYPES.ADD_SCAM}`,
	async ({ type, userId, url, impersonatedUrl, comment }, { rejectWithValue }) => {
		try {
			await scamReportService.addScamReport({
				type,
				url,
				impersonatedUrl,
				userId,
				comment
			});
			return { type, url };
		} catch (e: any) {
			return rejectWithValue({ message: e?.response?.data?.message });
		}
	}
);

export const addToScamGuest = createAsyncThunk<IReportScam, IReportScam, { rejectValue: SerializedError }>(
	`${REDUCERS_NAMES.SCAM}/${SCAM_ACTIONS_TYPES.ADD_SCAM}`,
	async ({ type, url, impersonatedUrl, comment, label }, { rejectWithValue }) => {
		try {
			await scamReportService.addScamReportGuest({
				type,
				url,
				impersonatedUrl,
				comment
			});
			return { type, label, url };
		} catch (e: any) {
			return rejectWithValue({ message: e?.response?.data?.message });
		}
	}
);

export const checkScam = createAsyncThunk<ICheckScamResponse, ICheckScamRequest, { rejectValue: SerializedError }>(
	`${REDUCERS_NAMES.SCAM}/${SCAM_ACTIONS_TYPES.CHECK_SCAM}`,
	async ({ url, type }, { rejectWithValue }) => {
		try {
			// CHECK SOCIAL NETWORK STATUS
			if (Object.values(SOC_MEDIA_TYPES).some((el) => url.includes(el))) {
				return {
					[url]: EWebStatus.UNKNOWN
				};
			}

			const data = await scamReportService.checkScam({ url, type });
			return {
				type,
				[url]: data?.status
			};
		} catch (e: any) {
			return rejectWithValue({ message: e?.response?.data?.message });
		}
	}
);

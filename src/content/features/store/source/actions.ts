import { createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { EWebStatus } from '../../../../api/types';
import { REDUCERS_NAMES } from '../../../../event/store/types';
import { scamReportService } from '../../../../api/services';
import { SOURCE_ACTIONS_TYPES } from './types';

interface IResponse {
	[key: string]: EWebStatus;
}

export const checkSourceType = createAsyncThunk<IResponse, string, { rejectValue: SerializedError }>(
	`${REDUCERS_NAMES.SOURCE}/${SOURCE_ACTIONS_TYPES.CHECK_SOURCE}`,
	async (url, { rejectWithValue }) => {
		try {
			const data = await scamReportService.checkScam({ url });
			return {
				[url]: data?.status || EWebStatus.UNKNOWN
			};
		} catch (e: any) {
			return rejectWithValue({ message: e?.response?.data?.message });
		}
	}
);

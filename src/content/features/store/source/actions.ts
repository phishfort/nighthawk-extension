import { createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { EWebStatus } from '../../../../api/types';
import { REDUCERS_NAMES } from '../../../../event/store/types';
import { scamReportService, storageService } from '../../../../api/services';
import { SOURCE_ACTIONS_TYPES } from './types';
import store from '../../../../common/store';
import { getValidUrl } from '../../../../api/utils/validate-url';
interface IResponse {
	[key: string]: EWebStatus;
}

export const checkSourceType = createAsyncThunk<IResponse, string, { rejectValue: SerializedError }>(
	`${REDUCERS_NAMES.SOURCE}/${SOURCE_ACTIONS_TYPES.CHECK_SOURCE}`,
	async (url, { rejectWithValue }) => {
		try {
			// check if the url is in the danger list
			const dangerAgreeList = await storageService.getDangerAgreeListFromStorage();
			const isDangerAgree =
				dangerAgreeList?.some((dangerUrl: string) => getValidUrl(dangerUrl) === getValidUrl(url)) || false;
			if (isDangerAgree) {
				return {
					[url]: EWebStatus.DANGEROUS
				};
			}

			// check previous state and if the source is already checked return it
			const state = store.getState();
			if (state?.source?.data !== null) {
				const data = state?.source?.data;
				if (data[url] && data[url] !== EWebStatus.UNKNOWN) return data;
			}

			const data = await scamReportService.checkScam({ url });
			return {
				[url]: data?.status || EWebStatus.UNKNOWN
			};
		} catch (e: any) {
			console.log('CheckSourceType Error: ', e?.response?.data?.message);
			return rejectWithValue({ message: e?.response?.data?.message });
		}
	}
);

import { createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { authService, storageService } from '../../../../api/services';
import { REDUCERS_NAMES } from '../../../../event/store/types';
import { AUTH_ACTIONS_TYPES } from '../user';

interface IResponse {
	token: string;
	isVerified: boolean;
}

export const userGuestAuth = createAsyncThunk<IResponse, {}, { rejectValue: SerializedError }>(
	`${REDUCERS_NAMES.AUTH}/${AUTH_ACTIONS_TYPES.GUEST}`,
	async (_, { rejectWithValue }) => {
		try {
			const data = await authService.userGuestAuth();
			storageService.setGuestTokenToStorage(data?.token as string);

			return {
				token: data?.token as string,
				isVerified: false
			};
		} catch (e: any) {
			return rejectWithValue({ message: e?.response?.data?.message });
		}
	}
);

export const getUserAuthInfo = createAsyncThunk(
	`${REDUCERS_NAMES.AUTH}/${AUTH_ACTIONS_TYPES.AUTH_INFO}`,
	async (_, {}) => {
		const userToken = await storageService.getTokenFromStorage();
		const guestToken = await storageService.getGuestTokenFromStorage();

		const isVerified = !!userToken;

		return {
			token: userToken || guestToken,
			isVerified
		};
	}
);

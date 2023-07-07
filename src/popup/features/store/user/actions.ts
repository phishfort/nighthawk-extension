import { createAsyncThunk } from '@reduxjs/toolkit';
import { REDUCERS_NAMES } from '../../../../event/store/types';
import { profileService } from '../../../../api/services/profile.service';
import { USER_ACTIONS_TYPES } from './types';
import { Iuuid } from '../../../../api/types/scam.types';
import { IRejectValue } from '../common';
import { IUserInfo } from '../../../../api/types/profile.types';

export const fetchUserInfo = createAsyncThunk(
	`${REDUCERS_NAMES.USER}/${USER_ACTIONS_TYPES.GET_INFO}`,
	async (_, { rejectWithValue }) => {
		const data = await profileService.getUserInfo();

		if (!data) {
			return rejectWithValue({ error: 'Some error' });
		}

		return data;
	}
);

export const updateUserInfo = createAsyncThunk<Iuuid, IUserInfo, { rejectValue: IRejectValue }>(
	`${REDUCERS_NAMES.USER}/${USER_ACTIONS_TYPES.UPDATE_INFO}`,
	async (args, { rejectWithValue }) => {
		const data = await profileService.updateUserProfile(args);

		if (!data) {
			return rejectWithValue({ error: 'Some error' });
		}

		return data;
	}
);

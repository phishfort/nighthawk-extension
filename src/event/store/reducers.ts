import { combineReducers } from '@reduxjs/toolkit';
import { trustedList } from '../../popup/features/store';
import { REDUCERS_NAMES } from './types';
import { sourceSlice } from '../../content/features/store/source/sourceSlice';
import { authSlice } from '../../popup/features/store/auth';
import { userSlice } from '../../popup/features/store/user';
import { scamSlice } from '../../popup/features/store/scam';

const rootReducer = combineReducers({
	[REDUCERS_NAMES.TRUSTED_LIST]: trustedList.trustedListSlice.reducer,
	[REDUCERS_NAMES.AUTH]: authSlice.reducer,
	[REDUCERS_NAMES.SOURCE]: sourceSlice.reducer,
	[REDUCERS_NAMES.USER]: userSlice.reducer,
	[REDUCERS_NAMES.SCAM]: scamSlice.reducer
});

export default rootReducer;

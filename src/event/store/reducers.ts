import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { trustedList } from '../../popup/features/store';
import { REDUCERS_NAMES } from './types';
import { sourceSlice } from '../../content/features/store/source/sourceSlice';
import { authSlice } from '../../popup/features/store/auth';
import { userSlice } from '../../popup/features/store/user';
import { scamSlice } from '../../popup/features/store/scam';

const combinedReducer = combineReducers({
	[REDUCERS_NAMES.TRUSTED_LIST]: trustedList.trustedListSlice.reducer,
	[REDUCERS_NAMES.AUTH]: authSlice.reducer,
	[REDUCERS_NAMES.SOURCE]: sourceSlice.reducer,
	[REDUCERS_NAMES.USER]: userSlice.reducer,
	[REDUCERS_NAMES.SCAM]: scamSlice.reducer
});

type State = ReturnType<typeof combinedReducer>;

function rootReducer(state: State | undefined, action: AnyAction): State {
	const next = combinedReducer(state, action);
	if (!state || (action.type !== authSlice.actions.signOut.type && state.auth.data?.token === next.auth.data?.token))
		return next;
	// Never carry a previous account's profile, trusted verdicts or pending requests across a login/logout.
	const clean = combinedReducer(undefined, { type: '@@account/reset' });
	return {
		...next,
		trustedList: clean.trustedList,
		user: clean.user,
		scam: clean.scam,
		source: { ...clean.source, activeTab: next.source.activeTab }
	};
}

export default rootReducer;

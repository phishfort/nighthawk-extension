import reducer from './reducers';
import { invalidateAuthRequests, setAuthData, signOut, userGuestAuth } from '../../popup/features/store/auth';
import { fetchUserInfo } from '../../popup/features/store/user/actions';
import { fetchTrustedList } from '../../popup/features/store/trusted-list/actions';
import { IUserInfo } from '../../api/types/profile.types';
import { ITrustedList } from '../../popup/pages/trusted-list-page/trusted-list.types';

test('account changes reset personal data and ignore responses from old pending requests', () => {
	let state = reducer(undefined, setAuthData({ token: 'A', isVerified: true }));
	state = reducer(state, fetchUserInfo.pending('A-profile', undefined));
	state = reducer(state, fetchTrustedList.pending('A-list', undefined));
	state = reducer(state, setAuthData({ token: 'B', isVerified: true }));
	state = reducer(
		state,
		fetchUserInfo.fulfilled({ email: 'private-A@example.test' } as IUserInfo, 'A-profile', undefined)
	);
	state = reducer(
		state,
		fetchTrustedList.fulfilled([{ url: 'https://private-A.example/' } as ITrustedList], 'A-list', undefined)
	);
	expect(state.user.data).toBeNull();
	expect(state.trustedList.data).toBeNull();
	state = reducer(state, fetchUserInfo.pending('B-profile', undefined));
	state = reducer(state, fetchUserInfo.fulfilled({ email: 'B@example.test' } as IUserInfo, 'B-profile', undefined));
	expect(state.user.data.email).toBe('B@example.test');
	state = reducer(state, signOut());
	expect(state.user.data).toBeNull();
	expect(state.trustedList.data).toBeNull();
});

test('an intentional transition cancels an old guest request before persistence completes', () => {
	let state = reducer(undefined, userGuestAuth.pending('old-guest', {}));
	state = reducer(state, invalidateAuthRequests());
	state = reducer(state, userGuestAuth.fulfilled({ token: 'old-guest', isVerified: false }, 'old-guest', {}));
	expect(state.auth.data).toBeNull();
});

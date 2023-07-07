import { RootState } from '../../../../event/store';

export const selectUserInfo = (state: RootState) => state?.user?.data;
export const selectLoadingYourAccount = (state: RootState) => state?.user?.isLoading;
export const selectGuestGuardianPoints = (state: RootState) => state?.user?.guestGuardianPoints;
export const selectRoutes = (state: RootState) => state?.user?.routes;

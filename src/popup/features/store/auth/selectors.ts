import { RootState } from '../../../../event/store';

export const selectAuthData = (state: RootState) => state?.auth?.data;
export const selectIsAuth = (state: RootState) => !!state?.auth?.data?.token;
export const selectIsVerified = (state: RootState) => state?.auth?.data?.isVerified;
export const selectIsNew = (state: RootState) => state?.auth?.data?.isNew;
export const selectShouldLogoutWeb = (state: RootState) => state?.auth?.shouldLogoutWeb;
export const selectIsLoading = (state: RootState) => state?.auth?.isLoading;
export const selectAuthRedirectUrl = (state: RootState) => state?.auth?.authRedirectUrl;

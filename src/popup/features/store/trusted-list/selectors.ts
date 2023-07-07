import { RootState } from '../../../../event/store';

export const selectTrustedList = (state: RootState) => state?.trustedList?.data;
export const selectAddedInfo = (state: RootState) => state?.trustedList?.addedInfo;
export const selectLoadingTrustedList = (state: RootState) => state?.trustedList?.isLoading;
export const selectTrustedListError = (state: RootState) => state?.trustedList?.error;
export const selectWhiteList = (state: RootState) => state?.trustedList?.whiteList;
export const selectGreyList = (state: RootState) => state?.trustedList?.greyList;
export const selectBlackList = (state: RootState) => state?.trustedList?.blackList;

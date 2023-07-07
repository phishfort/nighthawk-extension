import { RootState } from '../../../../event/store';
import { ECheckDataType } from '../../../../api/types';

export const selectScamData = (state: RootState) => state?.scam?.data;
export const selectCheckDataYoutube = (state: RootState) => state?.scam?.[ECheckDataType.YOUTUBE];
export const selectCheckDataTwitter = (state: RootState) => state?.scam?.[ECheckDataType.TWITTER];
export const selectCheckDataFacebook = (state: RootState) => state?.scam?.[ECheckDataType.FACEBOOK];
export const selectCheckDataLinkedin = (state: RootState) => state?.scam?.[ECheckDataType.LINKEDIN];
export const selectCheckDataGoogle = (state: RootState) => state?.scam?.[ECheckDataType.GOOGLE];
export const selectIsScamLoading = (state: RootState) => state?.scam?.isLoading;

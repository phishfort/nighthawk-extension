import * as React from 'react';
import { Grid } from '@mui/material';
import * as GlobalTypography from '../../components/common/global-typography';
import { GuardPoints } from '../../components/common/guard-points';
import { SwitchToggle } from '../../components/common/switch-toggle';
import { LinkTemplate } from '../../components/styled-components/link-template.styled';
import PopupContainer from '../../components/popup-container/popup-container.component';
import storeWithMiddleware from '../../../common/mockStore';
import { fetchUserInfo, selectUserInfo, updateUserInfo } from '../../features/store/user';
import { useAppSelector } from '../../../event/store';
import { IUserInfo } from '../../../api/types/profile.types';
import { EXTERNAL_ROUTES } from '../../components/navigator/routes.utils';
import { selectIsNew, selectIsVerified } from '../../features/store/auth';
import { storageService } from '../../../api/services';
import { handleRedirect } from '../../utils';

interface YourAccountPageProps {}

const YourAccountPage: React.FC<YourAccountPageProps> = () => {
	const userInfo: IUserInfo = useAppSelector(selectUserInfo) || {};
	const isNew = useAppSelector(selectIsNew);
	const isVerified = useAppSelector(selectIsVerified);

	const getUserInfo = async () => {
		const { dispatch } = await storeWithMiddleware;
		const points = await storageService.getPointsFromStorage();
		if (isNew && isVerified && points) {
			// @ts-ignore
			await dispatch(updateUserInfo({ guardianPoints: Number(points) } as IUserInfo));
			await storageService.removePointsFromStorage();
		}
		// @ts-ignore
		dispatch(fetchUserInfo());
	};

	React.useEffect(() => {
		getUserInfo();
	}, []);

	const handleUpdateUserInfo = (isSharingData: boolean) => {
		storeWithMiddleware
			// @ts-ignore
			.then(({ dispatch }) => dispatch(updateUserInfo({ isSharingData })))
			// @ts-ignore
			.then(() => storeWithMiddleware.then(({ dispatch }) => dispatch(fetchUserInfo())));
	};

	return (
		<PopupContainer>
			<Grid container direction="column" alignItems="center" justifyContent="center">
				<GlobalTypography.Text variant="subtitle1" colorVariant="common.white" fontWeight="fontWeightMedium">
					Your Account
				</GlobalTypography.Text>
				<GuardPoints points={String(userInfo.guardianPoints || 0)} />
				<Grid item container direction="column">
					<GlobalTypography.Text variant="body2" colorVariant="common.white" fontFamily="IBM Plex Sans" mt="0.5rem">
						Username
					</GlobalTypography.Text>
					<GlobalTypography.Text variant="subtitle2" colorVariant="common.white" fontFamily="IBM Plex Sans">
						{userInfo.username}
					</GlobalTypography.Text>
					<GlobalTypography.Text variant="body2" colorVariant="common.white" fontFamily="IBM Plex Sans" mt="0.5rem">
						Email
					</GlobalTypography.Text>
					<GlobalTypography.Text variant="subtitle2" colorVariant="common.white" fontFamily="IBM Plex Sans">
						{userInfo.email}
					</GlobalTypography.Text>
					<GlobalTypography.Text variant="body2" colorVariant="common.white" fontFamily="IBM Plex Sans" mt="0.5rem">
						Sharing data
					</GlobalTypography.Text>
					<SwitchToggle isChecked={userInfo.isSharingData} withLabel onChange={handleUpdateUserInfo} />
					<GlobalTypography.Text variant="body2" colorVariant="common.white" fontFamily="IBM Plex Sans">
						You are helping Nighthawk improve its service and keep users safe by sharing your data. You can turn this
						off at any time.
					</GlobalTypography.Text>
				</Grid>
				<Grid item container justifyContent="center" mt="1rem" mb="0.5rem">
					<LinkTemplate onClick={() => handleRedirect(EXTERNAL_ROUTES.PROFILE)}>
						<GlobalTypography.Text
							variant="body1"
							colorVariant="common.white"
							fontFamily="IBM Plex Sans"
							fontWeight="fontWeightMedium"
						>
							View More Account Settings
						</GlobalTypography.Text>
					</LinkTemplate>
				</Grid>
			</Grid>
		</PopupContainer>
	);
};

export default YourAccountPage;

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import * as GlobalTypography from '../../components/common/global-typography';
import { useAppDispatch, useAppSelector } from '../../../event/store';
import { EXTERNAL_ROUTES, ROUTES } from '../../components/navigator/routes.utils';
import { selectScamData } from '../../features/store/scam';
import HexagonBtn from '../../components/common/hexagon-button';
import { GuardPoints } from '../../components/common/guard-points';
import { useEffect } from 'react';
import { storageService } from '../../../api/services';
import { selectIsVerified, signOut } from '../../features/store/auth';
import { getUrlType, getValidUrl, handleRedirect, options } from '../../utils';
import { fetchUserInfo, selectUserInfo } from '../../features/store/user';
import storeWithMiddleware from '../../../common/mockStore';
import { IUserInfo } from '../../../api/types/profile.types';
import PopupContainer from '../../components/popup-container/popup-container.component';

const AddedToScamPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const scamData = useAppSelector(selectScamData);
	const isVerified = useAppSelector(selectIsVerified);
	const userInfo: IUserInfo = useAppSelector(selectUserInfo) || {};

	const handleAuth = async () => {
		await storageService.removeTokensFromStorage();
		dispatch(signOut());
		handleRedirect(EXTERNAL_ROUTES.SIGN_UP as string);
	};
	const getUserInfo = async () => {
		const { dispatch } = await storeWithMiddleware;
		//@ts-ignore
		dispatch(fetchUserInfo());
	};
	useEffect(() => {
		getUserInfo();
	}, []);

	const url = scamData?.url ? getValidUrl(scamData?.url) : '';
	const reportedType = url ? options.find((el) => el.value == getUrlType(url))?.label : options[0].label;
	return (
		<PopupContainer>
			<Grid container direction="column" justifyContent="center" alignItems="center">
				<GlobalTypography.Text
					variant="subtitle1"
					align="center"
					colorVariant="common.white"
					fontWeight="fontWeightBold"
					mb="1rem"
				>
					{`${reportedType} Reported`}
				</GlobalTypography.Text>

				<GuardPoints points={String(userInfo?.guardianPoints || 0)} />

				<GlobalTypography.Text
					variant="subtitle2"
					align="center"
					colorVariant="common.white"
					fontWeight="fontWeightBold"
					mt="1.25rem"
					sx={{ wordBreak: 'break-all' }}
				>
					{url}
				</GlobalTypography.Text>

				<GlobalTypography.Text variant="subtitle2" colorVariant="common.white" fontFamily="IBM Plex Sans">
					has been reported to Nighthawk.
				</GlobalTypography.Text>

				<GlobalTypography.Text
					variant="subtitle2"
					colorVariant="common.white"
					align="center"
					fontFamily="IBM Plex Sans"
					m="1.5rem 0.75rem"
				>
					Thank you for helping keep the community safe! &nbsp;
					{!isVerified && (
						<>
							<Link to={ROUTES.CREATE_ACCOUNT} onClick={handleAuth}>
								<b>Create an account</b>
							</Link>
							&nbsp; to track your Guardian points
						</>
					)}
				</GlobalTypography.Text>

				{!isVerified && (
					<HexagonBtn title="Create Account" width="225px" onClick={handleAuth} link={ROUTES.CREATE_ACCOUNT} />
				)}
			</Grid>
		</PopupContainer>
	);
};

export default AddedToScamPage;

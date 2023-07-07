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
import { getValidUrl, handleRedirect } from '../../utils';
import { selectGuestGuardianPoints, setGuestGuardianPoints } from '../../features/store/user';
import AuthWrapper from '../../components/auth-wrapper/auth-wrapper.component';

const AddedToScamPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const scamData = useAppSelector(selectScamData);
	const guestGuardianPoints = useAppSelector(selectGuestGuardianPoints);
	const isVerified = useAppSelector(selectIsVerified);

	const handleAuth = async () => {
		await storageService.removeTokensFromStorage();
		dispatch(signOut());
		handleRedirect(EXTERNAL_ROUTES.SIGN_UP as string);
	};

	useEffect(() => {
		// update this only to read fro backend
		storageService.getPointsFromStorage().then((points) => {
			const nextPoints = Number(points) || 0;
			storageService.setPointsToStorage(String(nextPoints));
			dispatch(setGuestGuardianPoints(nextPoints));
		});
	}, []);

	const url = scamData?.url ? getValidUrl(scamData?.url) : '';

	return (
		<AuthWrapper title={!isVerified ? 'SIGN IN' : ''} to={ROUTES.SIGN_IN} showBurger>
			<Grid container direction="column" justifyContent="center" alignItems="center">
				<GlobalTypography.Text
					variant="subtitle1"
					align="center"
					colorVariant="common.white"
					fontWeight="fontWeightBold"
					mb="1rem"
				>
					{`${scamData?.label} Reported`}
				</GlobalTypography.Text>

				<GuardPoints points={String(guestGuardianPoints || 0)} />

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
					<Link to={ROUTES.CREATE_ACCOUNT} onClick={handleAuth}>
						<b>Create an account</b>
					</Link>
					&nbsp; to track your Guardian points.
				</GlobalTypography.Text>

				<HexagonBtn title="Create Account" width="225px" onClick={handleAuth} link={ROUTES.CREATE_ACCOUNT} />
			</Grid>
		</AuthWrapper>
	);
};

export default AddedToScamPage;

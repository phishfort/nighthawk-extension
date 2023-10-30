import * as React from 'react';
import { UnknownContainer } from '../../components/styled-components/main-container.styled';
import * as GlobalTypography from '../../components/common/global-typography';
import { Grid } from '@mui/material';
import HexagonBtn from '../../components/common/hexagon-button';
import { ROUTES } from '../../components/navigator/routes.utils';
import { useAppSelector } from '../../../event/store';
import { selectIsAuth, selectIsVerified, userGuestAuth } from '../../features/store/auth';
import { useNavigate } from 'react-router-dom';
import storeWithMiddleware from '../../../common/mockStore';
import AuthWrapper from '../../components/auth-wrapper/auth-wrapper.component';
import { getActiveTab } from '../../../content/features/store/source/sourceSlice';
import { getValidUrl } from '../../utils';

const UnknownPage: React.FC = () => {
	const isVerified = useAppSelector(selectIsVerified);
	const isAuth = useAppSelector(selectIsAuth);
	const navigate = useNavigate();
	const activeTab = useAppSelector(getActiveTab);

	const handleAddScum = () => {
		if (!isAuth) {
			storeWithMiddleware
				// @ts-ignore
				.then(({ dispatch }) => dispatch(userGuestAuth()))
				.then(() => navigate(ROUTES.SCAM_REPORT));
		}
		navigate(ROUTES.SCAM_REPORT);
	};
	const url = activeTab ? getValidUrl(activeTab)?.split('/')[0] : '';

	return (
		<AuthWrapper Container={UnknownContainer} title={!isVerified ? 'SIGN IN' : ''} to={ROUTES.SIGN_IN} showBurger>
			<Grid container direction="column" alignItems="center" justifyContent="center" mt="2rem">
				<GlobalTypography.Text
					style={{
						whiteSpace: 'pre-wrap',
						wordBreak: 'break-word',
						textAlign: 'center'
					}}
					variant="subtitle1"
					colorVariant="common.white"
					fontWeight="fontWeightMedium"
				>
					{url}
				</GlobalTypography.Text>
				<GlobalTypography.Text variant="h3" colorVariant="common.white" fontWeight="fontWeightMedium">
					UNKNOWN
				</GlobalTypography.Text>
				<Grid item mt="3rem">
					<HexagonBtn title="Report This Site" width="225px" onClick={handleAddScum} />
				</Grid>
				<Grid item mt="0.5rem">
					<HexagonBtn
						title="Add to My Trusted Sites"
						width="225px"
						link={isVerified ? ROUTES.ADD_TRUSTED : ROUTES.SIGN_IN_ACCESS_TRUSTED}
					/>
				</Grid>
			</Grid>
		</AuthWrapper>
	);
};

export default UnknownPage;

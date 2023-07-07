import * as React from 'react';
import { ValidContainer } from '../../components/styled-components/main-container.styled';
import * as GlobalTypography from '../../components/common/global-typography';
import { Grid } from '@mui/material';
import HexagonBtn from '../../components/common/hexagon-button';
import { ROUTES } from '../../components/navigator/routes.utils';
import { HeartIcon } from '../../../common/icons/heart-icon';
import { NavLinkTemplate } from '../../components/styled-components/link-template.styled';
import { useAppSelector } from '../../../event/store';
import { selectIsVerified } from '../../features/store/auth';
import AuthWrapper from '../../components/auth-wrapper/auth-wrapper.component';

const ValidPage: React.FC = () => {
	const isVerified = useAppSelector(selectIsVerified);

	return (
		<AuthWrapper Container={ValidContainer} title={!isVerified ? 'SIGN IN' : ''} to={ROUTES.SIGN_IN} showBurger>
			<Grid container direction="column" alignItems="center" justifyContent="center" mt="2rem">
				<GlobalTypography.Text variant="subtitle1" colorVariant="common.white" fontWeight="fontWeightMedium">
					THIS SITE IS
				</GlobalTypography.Text>
				<GlobalTypography.Text variant="h3" colorVariant="common.white" fontWeight="fontWeightMedium">
					VALID
				</GlobalTypography.Text>
				<Grid item mt="3rem">
					<HexagonBtn title="Report Scam" width="225px" link={ROUTES.SCAM_REPORT} />
				</Grid>
				<Grid item mt="0.5rem">
					<NavLinkTemplate to={ROUTES.SUPPORT_NIGHTHAWK}>
						<HexagonBtn
							title="Support Nighthawk"
							width="225px"
							icon={
								<Grid item pl="1rem" xs={1} maxHeight="2.125rem">
									<HeartIcon />
								</Grid>
							}
						/>
					</NavLinkTemplate>
				</Grid>
			</Grid>
		</AuthWrapper>
	);
};

export default ValidPage;

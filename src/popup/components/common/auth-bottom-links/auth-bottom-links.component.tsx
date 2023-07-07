import { Grid } from '@mui/material';
import * as GlobalTypography from '../global-typography';
import * as React from 'react';
import { EXTERNAL_ROUTES } from '../../navigator/routes.utils';

const AuthBottomLinks = () => {
	return (
		<Grid container mt="0.75rem" justifyContent="center">
			<Grid item container>
				<GlobalTypography.Text variant="caption" colorVariant="common.white" fontFamily="IBM Plex Sans">
					By creating an account, you agree to PhishFort’s&nbsp;
				</GlobalTypography.Text>
				<GlobalTypography.Text
					variant="caption"
					colorVariant="common.white"
					fontFamily="IBM Plex Sans"
					fontWeight="fontWeightMedium"
				>
					<a href={EXTERNAL_ROUTES.TERMS_AND_CONDITIONS}>Terms and Conditions</a>
				</GlobalTypography.Text>
			</Grid>
			<Grid item container>
				<GlobalTypography.Text variant="caption" colorVariant="common.white" fontFamily="IBM Plex Sans">
					and confirm that you have read PhishFort’s&nbsp;
				</GlobalTypography.Text>
				<GlobalTypography.Text
					variant="caption"
					colorVariant="common.white"
					fontFamily="IBM Plex Sans"
					fontWeight="fontWeightMedium"
				>
					<a href={EXTERNAL_ROUTES.PRIVACY_POLICY}>Privacy Policy.</a>
				</GlobalTypography.Text>
			</Grid>
		</Grid>
	);
};

export default AuthBottomLinks;

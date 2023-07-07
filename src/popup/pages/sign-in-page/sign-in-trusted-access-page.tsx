import * as React from 'react';
import AuthWrapper from '../../components/auth-wrapper/auth-wrapper.component';
import { EXTERNAL_ROUTES, ROUTES } from '../../components/navigator/routes.utils';
import { Grid } from '@mui/material';
import * as GlobalTypography from '../../components/common/global-typography';
import { NavLinkTemplate } from '../../components/styled-components/nav-link-template.styled';
import AuthForm from '../../components/auth-form/auth-form.component';
import { EAuthTypes } from '../../features/store/auth';
import { handleRedirect } from '../../utils';

interface SignInPageProps {}

const SignInTrustedAccessPage: React.FC<SignInPageProps> = () => {
	return (
		<AuthWrapper title="CREATE ACCOUNT" to={ROUTES.CREATE_ACCOUNT}>
			<Grid container direction="column" alignItems="center" justifyContent="center">
				<GlobalTypography.Text
					variant="subtitle1"
					colorVariant="common.white"
					fontWeight="fontWeightMedium"
					align="center"
					m="0.5rem 2.5rem"
				>
					Sign In to Access Your Trusted List
				</GlobalTypography.Text>
				<GlobalTypography.Text
					variant="body1"
					colorVariant="common.white"
					align="center"
					fontFamily="IBM Plex Sans"
					m="0.5rem 1rem"
				>
					Your Trusted List is a customizable collection of websites and social media accounts that you’ve indicated you
					trust.
				</GlobalTypography.Text>

				<AuthForm type={EAuthTypes.SIGN_IN} />

				<Grid container justifyContent="center">
					<GlobalTypography.Text variant="body2" colorVariant="common.white" fontFamily="IBM Plex Sans">
						Don’t have an account?&nbsp;
					</GlobalTypography.Text>
					<NavLinkTemplate to={ROUTES.CREATE_ACCOUNT} onClick={() => handleRedirect(EXTERNAL_ROUTES.SIGN_UP as string)}>
						<GlobalTypography.Text
							variant="body2"
							colorVariant="common.white"
							fontFamily="IBM Plex Sans"
							fontWeight="fontWeightMedium"
						>
							Create an account.
						</GlobalTypography.Text>
					</NavLinkTemplate>
				</Grid>
			</Grid>
		</AuthWrapper>
	);
};

export default SignInTrustedAccessPage;

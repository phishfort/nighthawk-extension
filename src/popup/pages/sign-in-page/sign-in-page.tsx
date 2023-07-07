import * as React from 'react';
import AuthWrapper from '../../components/auth-wrapper/auth-wrapper.component';
import { ROUTES } from '../../components/navigator/routes.utils';
import { Grid } from '@mui/material';
import * as GlobalTypography from '../../components/common/global-typography';
import { NavLinkTemplate } from '../../components/styled-components/nav-link-template.styled';
import AuthForm from '../../components/auth-form/auth-form.component';
import storeWithMiddleware from '../../../common/mockStore';
import { EAuthTypes, userGuestAuth } from '../../features/store/auth';
import { useNavigate } from 'react-router-dom';
import { LinkTemplate } from '../../components/styled-components/link-template.styled';
import { handleRedirect } from '../../utils';

interface SignInPageProps {}

const SignInPage: React.FC<SignInPageProps> = () => {
	const navigate = useNavigate();

	const handleSignWithoutAcc = () => {
		storeWithMiddleware
			// @ts-ignore
			.then(({ dispatch }) => dispatch(userGuestAuth()))
			.then(() => {
				navigate(ROUTES.MAIN_PAGE);
				handleRedirect(process.env.REACT_APP_WEB_URL as string);
			});
	};

	return (
		<AuthWrapper title="CREATE ACCOUNT" to={ROUTES.CREATE_ACCOUNT}>
			<Grid container direction="column" alignItems="center" justifyContent="center">
				<GlobalTypography.Text variant="subtitle1" colorVariant="common.white" fontWeight="fontWeightMedium">
					Sign In
				</GlobalTypography.Text>

				<AuthForm type={EAuthTypes.SIGN_IN} />

				<Grid container justifyContent="center">
					<GlobalTypography.Text variant="body2" colorVariant="common.white" fontFamily="IBM Plex Sans">
						Don’t have an account?&nbsp;
					</GlobalTypography.Text>
					<NavLinkTemplate
						to={ROUTES.CREATE_ACCOUNT}
						onClick={() => handleRedirect(process.env.REACT_APP_WEB_URL as string)}
					>
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
				<LinkTemplate onClick={handleSignWithoutAcc}>
					<GlobalTypography.Text
						variant="body2"
						colorVariant="common.white"
						mt="0.75rem"
						fontFamily="IBM Plex Sans"
						fontWeight="fontWeightMedium"
					>
						Continue Without an Account
					</GlobalTypography.Text>
				</LinkTemplate>
			</Grid>
		</AuthWrapper>
	);
};

export default SignInPage;

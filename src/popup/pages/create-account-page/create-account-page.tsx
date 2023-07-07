import * as React from 'react';
import AuthWrapper from '../../components/auth-wrapper/auth-wrapper.component';
import * as GlobalTypography from '../../components/common/global-typography';
import { Grid } from '@mui/material';
import { ROUTES } from '../../components/navigator/routes.utils';
import { NavLinkTemplate } from '../../components/styled-components/nav-link-template.styled';
import AuthBottomLinks from '../../components/common/auth-bottom-links/auth-bottom-links.component';
import storeWithMiddleware from '../../../common/mockStore';
import { EAuthTypes, selectIsLoading, userGuestAuth } from '../../features/store/auth';
import { useNavigate } from 'react-router-dom';
import { LinkTemplate } from '../../components/styled-components/link-template.styled';
import AuthForm from '../../components/auth-form/auth-form.component';
import { handleRedirect } from '../../utils';
import { useAppSelector } from '../../../event/store';

interface CreateAccountPageProps {}

const CreateAccountPage: React.FC<CreateAccountPageProps> = () => {
	const navigate = useNavigate();
	const isLoading = useAppSelector(selectIsLoading);

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
		<AuthWrapper title="SIGN IN" to={ROUTES.SIGN_IN} footerContent={<AuthBottomLinks />}>
			<Grid container direction="column" alignItems="center" justifyContent="center">
				<GlobalTypography.Text variant="subtitle1" colorVariant="common.white" fontWeight="fontWeightMedium">
					Create an Account
				</GlobalTypography.Text>

				<AuthForm type={EAuthTypes.SIGN_UP} />

				<Grid container justifyContent="center">
					<GlobalTypography.Text variant="body2" colorVariant="common.white" fontFamily="IBM Plex Sans">
						Already have an account?&nbsp;
					</GlobalTypography.Text>
					<NavLinkTemplate to={ROUTES.SIGN_IN} onClick={() => handleRedirect(process.env.REACT_APP_WEB_URL as string)}>
						<GlobalTypography.Text
							variant="body2"
							colorVariant="common.white"
							fontFamily="IBM Plex Sans"
							fontWeight="fontWeightMedium"
						>
							Sign in.
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

export default CreateAccountPage;

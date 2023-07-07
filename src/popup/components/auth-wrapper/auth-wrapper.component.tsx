import React from 'react';
import TopLogo from '../common/logo/top-logo';
import BottomLogo from '../common/logo/bottom-logo';
import { NavLinkTemplate } from '../styled-components/nav-link-template.styled';
import { MainContainer } from '../styled-components/main-container.styled';
import * as GlobalTypography from '../common/global-typography';
import { handleRedirect } from '../../utils';
import { useAppDispatch, useAppSelector } from '../../../event/store';
import { storageService } from '../../../api/services';
import { selectIsAuth, signOut } from '../../features/store/auth';
import MenuContent from '../menu/menu-content.component';
import { EXTERNAL_ROUTES } from '../navigator/routes.utils';

interface IPopupContainerProps {
	Container?: any;
	title?: string;
	to: string;
	footerContent?: React.ReactNode;
	showBurger?: boolean;
	children?: React.ReactNode;
}

const AuthWrapper: React.FC<IPopupContainerProps> = ({
	Container = MainContainer,
	title,
	to,
	footerContent,
	showBurger,
	children
}) => {
	const isAuth = useAppSelector(selectIsAuth);
	const dispatch = useAppDispatch();

	const handleRedirectAuth = async () => {
		if (isAuth) {
			await storageService.removeTokensFromStorage();
			dispatch(signOut());
		}
		if (title === 'SIGN IN') handleRedirect(EXTERNAL_ROUTES.SING_IN as string);
		else if (title === 'CREATE ACCOUNT') handleRedirect(EXTERNAL_ROUTES.SIGN_UP as string);
	};

	return (
		<Container>
			<TopLogo menuContent={showBurger && <MenuContent />}>
				<NavLinkTemplate to={to} onClick={handleRedirectAuth}>
					<GlobalTypography.Text variant="body1" colorVariant="common.white" fontFamily="Work Sans" mt="-0.25rem">
						{title}
					</GlobalTypography.Text>
				</NavLinkTemplate>
			</TopLogo>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child, {});
				}
				return null;
			})}
			<BottomLogo>{footerContent}</BottomLogo>
		</Container>
	);
};

export default AuthWrapper;

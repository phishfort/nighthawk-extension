import React, { ReactNode } from 'react';
import { Grid } from '@mui/material';
import ArrowLink from '../arrow/arrow';
import { useAppSelector } from '../../../../event/store';
import { selectRoutes } from '../../../features/store/user';
import { MENU_ITEMS, privateRoutes, publicRoutes, ROUTES } from '../../navigator/routes.utils';
import { selectIsAuth, selectIsVerified } from '../../../features/store/auth';
import { getActiveTab, getSourceType } from '../../../../content/features/store/source/sourceSlice';
import { getInitRoute } from '../../../utils';
import { TopLogoSvg } from '../../../../common/icons/top-logo';

interface TopLogoProps {
	width?: number;
	height?: number;
	to?: string;
	menuContent?: ReactNode;
	children?: ReactNode;
}

const TopLogo: React.FC<TopLogoProps> = ({ width = 130, height = 22, menuContent, children }) => {
	const routes = useAppSelector(selectRoutes);
	const isAuth = useAppSelector(selectIsAuth);
	const isVerified = useAppSelector(selectIsVerified);
	const sourceType = useAppSelector(getSourceType);
	const activeTab = useAppSelector(getActiveTab);

	const initRoute = getInitRoute(activeTab, sourceType);
	const currentRoute = routes ? routes[1] : '';
	const prevRoute =
		currentRoute === ROUTES.MAIN_PAGE
			? initRoute
			: MENU_ITEMS.some((el) => el === currentRoute)
			? ROUTES.MAIN_PAGE
			: currentRoute === ROUTES.ADDED_TO_TRUSTED
			? ROUTES.TRUSTED_LIST
			: routes[0];

	const isAllowedRoute = isVerified
		? privateRoutes.some((el) => el.path === prevRoute)
		: publicRoutes.some((el) => el.path === prevRoute);
	const to = (isAllowedRoute && prevRoute) || (isAuth ? ROUTES.MAIN_PAGE : ROUTES.SIGN_IN);

	return (
		<Grid container justifyContent="space-between" mb="0.75rem">
			<Grid item container xs={menuContent ? 8 : 6}>
				{menuContent && <Grid mr="0.5rem">{menuContent}</Grid>}
				<Grid mt="0.15rem">
					<TopLogoSvg />
					{/* logo should be svg format. NightHawkLodo is svg react component. use it  */}
					{/* <NightHawkLogo width={width} height={height} /> */}
				</Grid>
			</Grid>
			<Grid item container justifyContent="end" xs={menuContent ? 4 : 6} mt={children ? '0.375rem' : '0.28rem'}>
				{children || <ArrowLink direction="right" to={to} />}
			</Grid>
		</Grid>
	);
};

export default TopLogo;

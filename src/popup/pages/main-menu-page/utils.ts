import { EXTERNAL_ROUTES, ROUTES } from '../../components/navigator/routes.utils';

interface IRenderMunuItem {
	title: string;
	path: string;
	onClick?: () => void;
}

export const renderMenu = (isVerified: boolean, onClick: () => void): IRenderMunuItem[] => {
	const publicMenu = [
		{ title: 'Trust List', path: ROUTES.SIGN_IN_ACCESS_TRUSTED },
		{ title: 'Dashboard', path: EXTERNAL_ROUTES.USER_GUIDE },
		{ title: 'Connect With Us', path: ROUTES.CONNECT_WITH_US },
		{ title: 'Support Nighthawk', path: ROUTES.SUPPORT_NIGHTHAWK },
		{ title: 'Sign in', path: EXTERNAL_ROUTES.SING_IN, onClick: onClick },
		{ title: 'Create An Account', path: EXTERNAL_ROUTES.SIGN_UP, onClick: onClick }
	];
	const privateMenu = [
		{ title: 'Trust List', path: ROUTES.TRUSTED_LIST },
		{ title: 'Your Account', path: ROUTES.YOUR_ACCOUNT },
		{ title: 'Dashboard', path: EXTERNAL_ROUTES.USER_GUIDE },
		{ title: 'Connect With Us', path: ROUTES.CONNECT_WITH_US },
		{ title: 'Support Nighthawk', path: ROUTES.SUPPORT_NIGHTHAWK }
	];

	return isVerified ? privateMenu : publicMenu;
};

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigatorRoutes from './components/navigator/navigator.routes';
import { useAppSelector } from '../event/store';
import { getActiveTab, getSourceType } from '../content/features/store/source/sourceSlice';
import { getInitRoute, handleRedirect } from './utils';
import { selectAuthRedirectUrl, selectShouldLogoutWeb } from './features/store/auth';
import { ROUTES } from './components/navigator/routes.utils';

export default function AppPopup() {
	const navigate = useNavigate();
	const sourceType = useAppSelector(getSourceType);
	const activeTab = useAppSelector(getActiveTab);
	const shouldLogoutWeb = useAppSelector(selectShouldLogoutWeb);
	const authRedirectUrl = useAppSelector(selectAuthRedirectUrl);

	const route = getInitRoute(activeTab, sourceType);
	const redirectUrl =
		authRedirectUrl === ROUTES.SIGN_UP_WITH_EMAIL || authRedirectUrl === ROUTES.SIGN_IN_WITH_EMAIL
			? authRedirectUrl
			: '';

	useEffect(() => {
		if (shouldLogoutWeb) {
			handleRedirect(`${process.env.REACT_APP_WEB_URL}${redirectUrl}`);
		}
	}, [shouldLogoutWeb]);

	useEffect(() => {
		if (sourceType) {
			navigate(route);
		}
	}, [sourceType]);

	return <NavigatorRoutes />;
}

import ScamReportPage from '../../pages/scam-report-page/scam-report-page';
import AddTrustedPage from '../../pages/add-to-your-trusted-list-page/add-to-your-trusted-list-page';
import ConnectWithUsPage from '../../pages/connect-with-us-page/connect-with-us-page';
import CreateAccountPage from '../../pages/create-account-page/create-account-page';
import ErrorPage from '../../pages/error-page/error-page';
import MainMenu from '../../pages/main-menu-page/main-menu-page';
import SignInPage from '../../pages/sign-in-page/sign-in-page';
import SupportNightHawkPage from '../../pages/support-nighthawk-page/support-nighthawk-page';
import TrustedListPage from '../../pages/trusted-list-page/trusted-list-page';
import TrustedSitesPage from '../../pages/trusted-sites-page/trusted-sites-page';
import YourAccountPage from '../../pages/your-account-page/your-account-page';
import { GenericRouteType } from './types';
import AddedToTrustedListPage from '../../pages/added-to-trusted-list-page/added-to-trusted-list-page';
import DangerousPage from '../../pages/dangerous-page';
import UnknownPage from '../../pages/unknown-page';
import ValidPage from '../../pages/valid-page';
import SignInTrustedAccessPage from '../../pages/sign-in-page/sign-in-trusted-access-page';
import AddedToScamPage from '../../pages/added-to-scam-page/added-to-scam-page';
import AboutGuardianPointsPage from '../../pages/about-guardian-points-page/about-guardian-points-page';
import QRCodePage from '../../pages/support-nighthawk-page/qr-code.component';
import AboutTrustlistPage from '../../pages/about-trust-list-page/about-trustlist-page';
import AboutSocialsPage from '../../pages/about-socials-page/about-socials-page';

export enum ROUTES {
	SIGN_IN = '/sign-in',
	SIGN_UP = '/signup',
	SIGN_IN_WITH_EMAIL = '/login',
	SIGN_UP_WITH_EMAIL = '/register-email',
	MAIN_PAGE = '/main-page',
	USER_GUIDE = '/',
	TRUSTED_LIST = '/trusted-list',
	YOUR_ACCOUNT = '/profile',
	CONNECT_WITH_US = '/connect-with-us',
	SUPPORT_NIGHTHAWK = '/support-nighthawk',
	TRUSTED_SITES = '/trusted-sites',
	CREATE_ACCOUNT = '/create-account',
	ERROR_PAGE = '/error-page',
	ADD_TRUSTED = '/add-trusted-list',
	SCAM_REPORT = '/scam-report',
	ADDED_TO_TRUSTED = '/added-to-trusted',
	ADDED_TO_SCAM = '/added-to-scam',
	DANGEROUS = '/dangerous',
	UNKNOWN = '/unknown',
	VALID = '/valid',
	SIGN_IN_ACCESS_TRUSTED = '/sign-in-access-trusted',
	ABOUT_GUARDIAN_POINTS = '/about-guardian-points',
	QR_CODE = '/qr-code',
	TERMS_AND_CONDITIONS = '/terms-and-conditions',
	PRIVACY_POLICY = '/privacy-policy',
	NIGHTHAWK_TRUSTED_LIST = '/nighthawk-trusted-list',
	ABOUT_TRUSTED_LIST = '/about-trusted-list',
	ABOUT_SOCIALS_PAGE = '/about-socials_page'
}

const unitedRoutes: GenericRouteType[] = [
	{ component: MainMenu, path: ROUTES.MAIN_PAGE },
	{ component: ConnectWithUsPage, path: ROUTES.CONNECT_WITH_US },
	{ component: SupportNightHawkPage, path: ROUTES.SUPPORT_NIGHTHAWK },
	{ component: DangerousPage, path: ROUTES.DANGEROUS },
	{ component: UnknownPage, path: ROUTES.UNKNOWN },
	{ component: ValidPage, path: ROUTES.VALID },
	{ component: ScamReportPage, path: ROUTES.SCAM_REPORT },
	{ component: AboutGuardianPointsPage, path: ROUTES.ABOUT_GUARDIAN_POINTS },
	{ component: AboutTrustlistPage, path: ROUTES.ABOUT_TRUSTED_LIST },
	{ component: AddedToScamPage, path: ROUTES.ADDED_TO_SCAM },
	{ component: QRCodePage, path: ROUTES.QR_CODE },
	{ component: ErrorPage, path: ROUTES.ERROR_PAGE },
	{ component: AboutSocialsPage, path: ROUTES.ABOUT_SOCIALS_PAGE }
];

export const EXTERNAL_ROUTES = {
	USER_GUIDE: `${process.env.REACT_APP_WEB_URL}${ROUTES.USER_GUIDE}`,
	SING_IN: `${process.env.REACT_APP_WEB_URL}${ROUTES.SIGN_IN_WITH_EMAIL}`,
	SIGN_UP: `${process.env.REACT_APP_WEB_URL}${ROUTES.SIGN_UP}`,
	TERMS_AND_CONDITIONS: `${process.env.REACT_APP_WEB_URL}${ROUTES.TERMS_AND_CONDITIONS}`,
	PRIVACY_POLICY: `${process.env.REACT_APP_WEB_URL}${ROUTES.PRIVACY_POLICY}`,
	TRUSTED_LIST: `${process.env.REACT_APP_WEB_URL}${ROUTES.TRUSTED_LIST}`,
	PROFILE: `${process.env.REACT_APP_WEB_URL}${ROUTES.YOUR_ACCOUNT}`,
	NIGHTHAWK_TRUSTED_LIST: `${process.env.REACT_APP_WEB_URL}${ROUTES.NIGHTHAWK_TRUSTED_LIST}`,
	SAFE_BROWSING: `${process.env.REACT_APP_SAFE_BROWSER_URL}`
};

export const publicRoutes: GenericRouteType[] = [
	...unitedRoutes,
	{ component: SignInPage, path: ROUTES.SIGN_IN },
	{ component: CreateAccountPage, path: ROUTES.CREATE_ACCOUNT },
	{ component: TrustedSitesPage, path: ROUTES.TRUSTED_SITES },
	{ component: SignInTrustedAccessPage, path: ROUTES.SIGN_IN_ACCESS_TRUSTED }
];
export const privateRoutes: GenericRouteType[] = [
	...unitedRoutes,
	{ component: TrustedListPage, path: ROUTES.TRUSTED_LIST },
	{ component: YourAccountPage, path: ROUTES.YOUR_ACCOUNT },
	{ component: AddTrustedPage, path: ROUTES.ADD_TRUSTED },
	{ component: AddedToTrustedListPage, path: ROUTES.ADDED_TO_TRUSTED },
	{ component: AddedToScamPage, path: ROUTES.ADDED_TO_SCAM }
];

export const MENU_ITEMS = [
	ROUTES.SCAM_REPORT,
	ROUTES.TRUSTED_LIST,
	ROUTES.YOUR_ACCOUNT,
	ROUTES.CONNECT_WITH_US,
	ROUTES.SUPPORT_NIGHTHAWK
];

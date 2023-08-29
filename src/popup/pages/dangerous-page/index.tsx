import * as React from 'react';
import { DangerousContainer } from '../../components/styled-components/main-container.styled';
import * as GlobalTypography from '../../components/common/global-typography';
import { Grid } from '@mui/material';
import HexagonBtn from '../../components/common/hexagon-button';
import { EXTERNAL_ROUTES, ROUTES } from '../../components/navigator/routes.utils';
import { browser } from '../../../browser-service';
import AuthWrapper from '../../components/auth-wrapper/auth-wrapper.component';
import { useAppSelector } from '../../../event/store';
import { selectIsVerified } from '../../features/store/auth';

const DangerousPage: React.FC = () => {
	const isVerified = useAppSelector(selectIsVerified);
	const [url, setUrl] = React.useState<string>('');

	const HandleShutDown = () => {
		browser.tabs.create({
			url: url ? `${EXTERNAL_ROUTES.SAFE_BROWSING}?url=${url}` : EXTERNAL_ROUTES.SAFE_BROWSING
		});
	};

	const HandleToSafety = () => {
		browser.tabs.goBack();
	};

	React.useEffect(() => {
		browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
			const tab = tabs[0];
			if (tab && tab.id) {
				setUrl(tab.url || '');
			}
		});
	}, []);
	return (
		<AuthWrapper Container={DangerousContainer} title={!isVerified ? 'SIGN IN' : ''} to={ROUTES.SIGN_IN} showBurger>
			<Grid container direction="column" alignItems="center" justifyContent="center" mt="2rem">
				<GlobalTypography.Text variant="subtitle1" colorVariant="common.white" fontWeight="fontWeightMedium">
					THIS SITE IS
				</GlobalTypography.Text>
				<GlobalTypography.Text variant="h3" colorVariant="common.white" fontWeight="fontWeightMedium">
					DANGEROUS
				</GlobalTypography.Text>
				<Grid item mt="3rem">
					<HexagonBtn title="Help Shut This Site Down" width="225px" onClick={HandleShutDown} />
				</Grid>
				<Grid item mt="0.5rem">
					<HexagonBtn title="Back to Safety" width="225px" onClick={HandleToSafety} />
				</Grid>
			</Grid>
		</AuthWrapper>
	);
};

export default DangerousPage;

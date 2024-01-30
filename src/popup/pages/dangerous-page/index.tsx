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
import { getActiveTab } from '../../../content/features/store/source/sourceSlice';
import { pattern } from '../../utils';
import { removeWWW } from '../../../content/utils/index.util';

const DangerousPage: React.FC = () => {
	const activeTab = useAppSelector(getActiveTab);
	const isVerified = useAppSelector(selectIsVerified);
	const [dangerUrl, setDangerUrl] = React.useState<string>('');

	const HandleShutDown = () => {
		browser.tabs.create({
			url: dangerUrl ? `${EXTERNAL_ROUTES.SAFE_BROWSING}&url=${dangerUrl}` : EXTERNAL_ROUTES.SAFE_BROWSING
		});
	};
	const HandleToSafety = () => {
		browser.tabs.goBack();
	};
	const getDangerURL = () => {
		try {
			const parsedUrl = new URL(activeTab);
			return pattern.test(activeTab) && parsedUrl.searchParams.has('url')
				? parsedUrl.searchParams.get('url')
				: activeTab;
		} catch (error) {
			console.error('Error parsing URL:', error);
			return activeTab;
		}
	};

	React.useEffect(() => {
		setDangerUrl(getDangerURL() as string);
	}, [activeTab]);

	const host = dangerUrl;

	return (
		<AuthWrapper Container={DangerousContainer} title={!isVerified ? 'SIGN IN' : ''} to={ROUTES.SIGN_IN} showBurger>
			<Grid container direction="column" alignItems="center" justifyContent="center" mt="2rem">
				<GlobalTypography.Text
					style={{
						whiteSpace: 'pre-wrap',
						wordBreak: 'break-word',
						textAlign: 'center',
						overflowX: 'auto',
						overflowY: 'hidden',
						scrollbarWidth: 'thin',
						maxWidth: 300
					}}
					variant="subtitle1"
					colorVariant="common.white"
					fontWeight="fontWeightMedium"
				>
					{host}
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

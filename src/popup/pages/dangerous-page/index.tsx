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
import { removeWWW, shortenUrl } from '../../../content/utils/index.util';
import CopyIcon from '../../components/common/icons/copy-icon';
import ConnectButton from '../connect-with-us-page/components/button';

const DangerousPage: React.FC = () => {
	const activeTab = useAppSelector(getActiveTab);
	const isVerified = useAppSelector(selectIsVerified);
	const [dangerUrl, setDangerUrl] = React.useState<string>('');
	const [copyText, setCopyText] = React.useState('Copy full URL');

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
			// decode the URL 
			if (parsedUrl.searchParams.has('url') && pattern.test(activeTab)) {
				const decodeURI = decodeURIComponent(parsedUrl.searchParams.get('url') as string)
				return decodeURI;
			}
		} catch (error) {
			console.error('Error parsing URL:', error);
			return activeTab;
		}
	};

	React.useEffect(() => {
		setDangerUrl(getDangerURL() as string);
	}, [activeTab]);

	const host = dangerUrl ? shortenUrl(dangerUrl) : '';
	const handleCopy = () => {
		navigator.clipboard.writeText(dangerUrl).then(() => {
			setCopyText('Copied');
			setTimeout(() => {
				setCopyText('Copy full URL');
			}, 2000);
		});
	};

	return (
		<AuthWrapper Container={DangerousContainer} title={!isVerified ? 'SIGN IN' : ''} to={ROUTES.SIGN_IN} showBurger>
			<Grid container direction="column" alignItems="center" justifyContent="center" mt="2rem">
				<GlobalTypography.Text
					style={{
						whiteSpace: 'pre-wrap',
						wordBreak: 'break-word'
					}}
					variant="subtitle1"
					colorVariant="common.white"
					fontWeight="fontWeightMedium"
				>
					{host}
				</GlobalTypography.Text>
				{host.length > 1 && (
					<GlobalTypography.Text
						textAlign={'center'}
						variant="subtitle1"
						fontWeight={'fontWeightMedium'}
						colorVariant="common.white"
					>
						<ConnectButton icon={<CopyIcon />} title={copyText} onClick={handleCopy} />
					</GlobalTypography.Text>
				)}
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

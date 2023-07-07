import * as React from 'react';
import { StyledContainer } from '../../components/styled-components/styled-container';
import ConnectLink from './components/connect-link';
import PopupContainer from '../../components/popup-container/popup-container.component';
import * as GlobalTypography from '../../components/common/global-typography';

interface ConnectWithUsPageProps {}

const ConnectWithUsPage: React.FC<ConnectWithUsPageProps> = () => {
	return (
		<PopupContainer>
			<StyledContainer>
				<GlobalTypography.Text variant="subtitle1" colorVariant="common.white" fontWeight="fontWeightBold" mb="1rem">
					Connect with Us
				</GlobalTypography.Text>
				<ConnectLink title="Twitter" link="twitter.com/NighthawkPlugin" />
				<ConnectLink title="Discord" link="discord.gg/psb9b2FGu9" />
			</StyledContainer>
		</PopupContainer>
	);
};

export default ConnectWithUsPage;

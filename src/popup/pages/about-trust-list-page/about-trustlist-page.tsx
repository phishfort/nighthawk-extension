import * as React from 'react';
import * as GlobalTypography from '../../components/common/global-typography';
import PopupContainer from '../../components/popup-container/popup-container.component';

const AboutTrustlistPage: React.FC = () => {
	return (
		<PopupContainer>
			<GlobalTypography.Text
				variant="subtitle1"
				align="center"
				colorVariant="common.white"
				fontWeight="fontWeightBold"
				mt="0.5rem"
			>
				Note about Trust list
			</GlobalTypography.Text>

			<GlobalTypography.Text
				variant="subtitle2"
				align="center"
				colorVariant="common.white"
				fontFamily="IBM Plex Sans"
				m="1rem 0rem"
				lineHeight="1.25rem"
			>
				The Nighthawk team does not review your Personal Trust List. If you want the item to undergo review and be added
				to the Global Trust List, please reach out to us on Discord.
			</GlobalTypography.Text>

			<GlobalTypography.Text
				variant="subtitle2"
				align="center"
				colorVariant="common.white"
				fontFamily="IBM Plex Sans"
				ml="1rem"
				mr="1rem"
				mb="1rem"
			>
				Thank you for your contributions, Nighthawk team
			</GlobalTypography.Text>
		</PopupContainer>
	);
};

export default AboutTrustlistPage;

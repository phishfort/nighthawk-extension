import * as React from 'react';
import * as GlobalTypography from '../../components/common/global-typography';
import PopupContainer from '../../components/popup-container/popup-container.component';

const AboutSocialsPage: React.FC = () => {
	return (
		<PopupContainer>
			<GlobalTypography.Text
				variant="subtitle1"
				align="center"
				colorVariant="common.white"
				fontWeight="fontWeightBold"
				mt="0.5rem"
			>
				Note about Social Sites
			</GlobalTypography.Text>
			<GlobalTypography.Text
				variant="subtitle2"
				align="center"
				colorVariant="common.white"
				fontFamily="IBM Plex Sans"
				m="1rem 0rem"
				lineHeight="1.25rem"
			>
				On this social media platform, we can assure users that the platform itself is secure, but individual accounts
				in this platform vary in safety. To address this, we have implemented an icon system next to each account,
				indicating their safety status.
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
				Thank you for your using our extension, Nighthawk team
			</GlobalTypography.Text>
		</PopupContainer>
	);
};

export default AboutSocialsPage;

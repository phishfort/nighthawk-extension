import * as React from 'react';
import * as GlobalTypography from '../../components/common/global-typography';
import PopupContainer from '../../components/popup-container/popup-container.component';

const AboutGuardianPointsPage: React.FC = () => {
	return (
		<PopupContainer>
			<GlobalTypography.Text
				variant="subtitle1"
				align="center"
				colorVariant="common.white"
				fontWeight="fontWeightBold"
				mt="0.5rem"
			>
				What Are Guardian Points?
			</GlobalTypography.Text>

			<GlobalTypography.Text
				variant="subtitle2"
				align="center"
				colorVariant="common.white"
				fontFamily="IBM Plex Sans"
				m="1rem 0rem"
				lineHeight="1.25rem"
			>
				Guardian Points are rewards for reporting malicious sites and accounts through Nighthawk’s Report a Scam form.
				If you feel you are on a suspicious URL or social media account page, please, report it to our team immediately
				to help keep everyone safe.
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

export default AboutGuardianPointsPage;

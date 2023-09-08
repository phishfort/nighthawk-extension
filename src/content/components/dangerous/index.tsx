import * as React from 'react';
import { useState } from 'react';
import * as Styled from './dangerous.styled';
import { Grid } from '@mui/material';
import logo from '../../../assets/images/logo.png';
import PhishFortLogo from '../../../popup/components/common/icons/phishfortLogo';
import * as GlobalTypography from '../../../popup/components/common/global-typography';
import { browser } from '../../../browser-service';
import { TopLogoSvg } from '../../../common/icons/top-logo';

const DangerousContentPage: React.FC = () => {
	const host = document.location.host;
	const [dangerousAgree, setDangerousAgree] = useState(false);

	if (dangerousAgree) return null;

	const handleDangerousAgree = () => {
		setDangerousAgree(true);
	};

	const anchor = document.getElementById('nighthawk-content-anchor');
	if (anchor) anchor.style.display = 'block';

	return (
		<>
			<Styled.Image src={browser?.runtime?.getURL('static/media/bg-dangerous.39b283a19dfc48dacc0b.png')} />
			<Styled.DangerousContainer container direction="column">
				<Grid item container justifyContent="start" mt="2rem" ml="2rem">
					<TopLogoSvg width="170" height="28" />
				</Grid>

				<Grid item container direction="column" justifyContent="center" alignItems="center" flexGrow={1}>
					<GlobalTypography.Text variant="h2" colorVariant="common.white" fontWeight="bold">
						WARNING
					</GlobalTypography.Text>
					<GlobalTypography.Text variant="h4" colorVariant="common.white" fontWeight="bold">
						THIS SITE IS DANGEROUS
					</GlobalTypography.Text>
					<GlobalTypography.Text variant="h5" colorVariant="common.white" mt="2rem" mb="1rem">
						It is recommended that you do not visit this site:
					</GlobalTypography.Text>
					<Styled.BorderBox item container justifyContent="center" alignItems="center">
						<GlobalTypography.Text variant="h4" colorVariant="common.white">
							{host}
						</GlobalTypography.Text>
					</Styled.BorderBox>
					<GlobalTypography.Text
						variant="subtitle1"
						colorVariant="common.white"
						align="center"
						mt="1rem"
						mb="1rem"
						maxWidth="36rem"
						fontWeight="fontWeightMedium"
					>
						The website that you were about to visit has been identified as potentially dangerous by Nighthawk.
					</GlobalTypography.Text>
					<Styled.PseudoLink onClick={handleDangerousAgree}>
						<GlobalTypography.Text
							variant="h6"
							colorVariant="common.white"
							fontWeight="fontWeightMedium"
							align="center"
							mt="1rem"
						>
							I know what I’m doing, proceed to this site.
						</GlobalTypography.Text>
					</Styled.PseudoLink>
					<GlobalTypography.Text
						colorVariant="common.white"
						fontWeight="fontWeightMedium"
						align="center"
						my="1rem"
						variant="h6"
						maxWidth="36rem"
					>
						<a
							href={`${process.env.REACT_APP_FALSE_POSITIVE_FORM}`}
							target="_blank"
							style={{ color: 'white', textDecorationColor: 'white' }}
						>
							Is this false positive? Let us know.
						</a>{' '}
					</GlobalTypography.Text>
				</Grid>

				<Grid item container justifyContent="center" mb="2rem">
					<PhishFortLogo />
				</Grid>
			</Styled.DangerousContainer>
		</>
	);
};

export default DangerousContentPage;

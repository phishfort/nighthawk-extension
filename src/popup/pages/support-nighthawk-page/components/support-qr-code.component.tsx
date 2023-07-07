import { StyledContainer } from '../../../components/styled-components/styled-container';
import * as GlobalTypography from '../../../components/common/global-typography';
import * as Styled from '../support-page.styled';
import QRCode from '../../../../assets/images/qr-code.png';

const QrCodeScreen = () => {
	const code = process.env.REACT_APP_ETH_CODE!;

	return (
		<StyledContainer>
			<GlobalTypography.Text variant="subtitle1" colorVariant="common.white" mt="1rem" mb="0.5rem" align="center">
				ETH QR Code
			</GlobalTypography.Text>
			<Styled.ImageContainer container item>
				<img width={150} height={150} src={QRCode} alt="Logo" />
			</Styled.ImageContainer>
			<GlobalTypography.Text
				colorVariant="common.white"
				align="center"
				mt="1rem"
				fontFamily="IBM Plex Sans"
				variant="inherit"
				sx={{ fontSize: '0.6rem' }}
			>
				{code}
			</GlobalTypography.Text>
		</StyledContainer>
	);
};
export default QrCodeScreen;

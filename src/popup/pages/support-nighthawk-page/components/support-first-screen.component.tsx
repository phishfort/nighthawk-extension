import { StyledContainer } from '../../../components/styled-components/styled-container';
import * as GlobalTypography from '../../../components/common/global-typography';
import { Grid } from '@mui/material';
import IconWithText from './icon-with-text';
import QrIcon from '../../../components/common/icons/qr-icon';

interface IProps {
	handleRedirectToQrCode: () => void;
}

const SupportFirstScreen = ({ handleRedirectToQrCode }: IProps) => {
	return (
		<StyledContainer>
			<GlobalTypography.Text variant="subtitle1" colorVariant="common.white" mb="1rem" align="center">
				Support Nighthawk
			</GlobalTypography.Text>
			<GlobalTypography.Text align="center" colorVariant="common.white" mb="0.5rem" textTransform="uppercase">
				send to eth
			</GlobalTypography.Text>

			<Grid container justifyContent="center" ml="0.5rem">
				<IconWithText onClick={handleRedirectToQrCode} xs={5} icon={<QrIcon />} text={'Scan QR Code'} />
			</Grid>
		</StyledContainer>
	);
};

export default SupportFirstScreen;

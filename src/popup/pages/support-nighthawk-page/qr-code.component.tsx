import * as React from 'react';
import PopupContainer from '../../components/popup-container/popup-container.component';
import QrCodeScreen from './components/support-qr-code.component';

interface IProps {}

const QRCodePage: React.FC<IProps> = () => {
	return (
		<PopupContainer>
			<QrCodeScreen />
		</PopupContainer>
	);
};

export default QRCodePage;

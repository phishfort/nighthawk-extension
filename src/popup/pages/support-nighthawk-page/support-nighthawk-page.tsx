import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import PopupContainer from '../../components/popup-container/popup-container.component';
import SupportFirstScreen from './components/support-first-screen.component';
import { ROUTES } from '../../components/navigator/routes.utils';

interface SupportNightHawkPageProps {}

const SupportNightHawkPage: React.FC<SupportNightHawkPageProps> = () => {
	const navigate = useNavigate();

	const handleRedirectToQrCode = () => {
		navigate(ROUTES.QR_CODE);
	};

	return (
		<PopupContainer>
			<SupportFirstScreen handleRedirectToQrCode={handleRedirectToQrCode} />
		</PopupContainer>
	);
};

export default SupportNightHawkPage;

import * as React from 'react';
import { StyledTextHeader } from '../../components/styled-components/styled-text-header';
import { StyledTrustSitesContainer } from './trusted-sites-page.styled';
import PopupContainer from '../../components/popup-container/popup-container.component';

interface TrustedSitesPageProps {}

const TrustedSitesPage: React.FC<TrustedSitesPageProps> = () => {
	return (
		<PopupContainer>
			<StyledTrustSitesContainer>
				<StyledTextHeader>Trusted Sites Page</StyledTextHeader>
			</StyledTrustSitesContainer>
		</PopupContainer>
	);
};

export default TrustedSitesPage;

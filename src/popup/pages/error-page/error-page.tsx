import * as React from 'react';
import LinkButton from '../../components/common/link';
import PopupContainer from '../../components/popup-container/popup-container.component';

interface ErrorPageProps {}

const ErrorPage: React.FC<ErrorPageProps> = () => {
	return (
		<PopupContainer>
			<div>
				Error Page
				<LinkButton title="Get back to Main Page" />
			</div>
		</PopupContainer>
	);
};

export default ErrorPage;

import React from 'react';
import { LinkBlockTemplate } from '../../../components/styled-components/link-template.styled';
import { StyledButton } from './button.styled';
import * as GlobalTypography from '../../../components/common/global-typography';

interface ArrowLinkProps {
	title: string;
	icon: React.ReactNode;
	link?: string;
	onClick?: () => void;
}

const ConnectButton: React.FC<ArrowLinkProps> = ({ icon, title, link, onClick }) => {
	return (
		<StyledButton onClick={onClick}>
			{link ? (
				<LinkBlockTemplate href={`https://${link}`} rel="noreferrer" target={'_blank'}>
					<span>{icon}</span>
					<GlobalTypography.Text colorVariant="common.white" variant="body2">
						{title}
					</GlobalTypography.Text>
				</LinkBlockTemplate>
			) : (
				<>
					<span>{icon}</span>
					<GlobalTypography.Text colorVariant="common.white" variant="body2">
						{title}
					</GlobalTypography.Text>
				</>
			)}
		</StyledButton>
	);
};

export default ConnectButton;

import React from 'react';
import ConnectButton from './button';
import { ButtonContainer, LinkContainer } from './connect-link.styled';
import * as GlobalTypography from '../../../components/common/global-typography';
import VisitIcon from '../../../components/common/icons/visit-site-icon';

interface ConnectLinkProps {
	title: string;
	link: string;
}

const ConnectLink: React.FC<ConnectLinkProps> = ({ link, title }) => {
	return (
		<LinkContainer>
			<GlobalTypography.Text colorVariant="common.white" variant="subtitle2" textTransform="uppercase">
				{title}
			</GlobalTypography.Text>
			<GlobalTypography.Text colorVariant="common.white" variant="body1" fontFamily="IBM Plex Sans">
				{link}
			</GlobalTypography.Text>
			<ButtonContainer>
				<ConnectButton link={link} icon={<VisitIcon />} title={'Visit Site'} />
			</ButtonContainer>
		</LinkContainer>
	);
};

export default ConnectLink;

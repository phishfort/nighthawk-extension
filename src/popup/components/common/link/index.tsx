import React, { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../navigator/routes.utils';
import { StyledLink } from './link.styled';
import { LinkTemplate } from '../../styled-components/link-template.styled';
import { browser } from '../../../../browser-service';
import { handleRedirect } from '../../../utils';

interface LinkButtonProps {
	title?: string;
	to?: string;
	onClick?: MouseEventHandler<HTMLDivElement>;
}

const LinkButton: React.FC<LinkButtonProps> = ({ title, to = ROUTES.MAIN_PAGE, onClick }) => {
	return (
		<StyledLink onClick={onClick}>
			{to.startsWith('http') ? (
				<LinkTemplate onClick={() => handleRedirect(to)}>
					<span className="title">{title && title}</span>
				</LinkTemplate>
			) : (
				<Link className="link" to={to}>
					<span className="title">{title && title}</span>
				</Link>
			)}
		</StyledLink>
	);
};

export default LinkButton;

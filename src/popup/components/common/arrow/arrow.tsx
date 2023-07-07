import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../navigator/routes.utils';
import { StyledArrow } from './arrow.styled';

interface ArrowLinkProps {
	direction?: 'left' | 'right' | 'top' | 'bottom';
	to?: string;
}

const directions = {
	left: `-45`,
	right: `135`,
	top: `45`,
	bottom: `-135`
};

const ArrowLink: React.FC<ArrowLinkProps> = ({ direction = `right`, to = ROUTES.MAIN_PAGE }) => {
	return (
		<Link to={to}>
			<StyledArrow direction={directions[direction as keyof typeof directions]} />
		</Link>
	);
};

export default ArrowLink;

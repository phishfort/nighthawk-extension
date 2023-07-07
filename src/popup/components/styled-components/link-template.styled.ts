import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const LinkTemplate = styled.a`
	text-decoration: none;
	cursor: pointer;
`;

export const NavLinkTemplate = styled(Link)`
	text-decoration: none;
	cursor: pointer;
`;

export const LinkBlockTemplate = styled(LinkTemplate)`
	display: flex;
	align-items: center;
	gap: 4px;
`;

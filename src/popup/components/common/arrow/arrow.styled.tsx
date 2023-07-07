import styled from '@emotion/styled';
import { COLORS } from '../../../../common/constants';

const arrow = styled.span`
	display: block;
	width: 9px;
	height: 9px;
	border-top: 2px solid ${COLORS.white};
	border-left: 2px solid ${COLORS.white};
	cursor: pointer;
`;

export const StyledArrow = styled(arrow)<{ direction: string }>`
	transform: rotate(${(props) => props.direction}deg);
`;

import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const HexagonContainer = styled.div<{
	length: number;
	theme?: Theme;
}>`
	position: relative;
	max-height: 80px;

	span {
		position: relative;
		top: -35px;
		background-image: none !important;
		display: block;
		cursor: pointer;
		width: 80px;
		height: 140px;
		line-height: 140px;
		text-align: center;
		vertical-align: center;
		font-size: ${({ theme, length }) => (length > 2 ? theme.typography.h3.fontSize : theme.typography.h2.fontSize)};
		font-weight: ${({ theme }) => theme.typography.fontWeightBold};
		color: ${({ theme }) => theme.palette.primary.contrastText};
		z-index: 2;
	}

	span:before,
	span:after {
		width: 80px;
		content: '';
		position: absolute;
		height: 50%;
		left: 0;
		z-index: -1;
		background: ${({ theme }) => theme.palette.common.white};
	}

	span:before {
		border-width: 2px 2px 0 2px;
		top: 0;
		transform-origin: center bottom;
		transform: perspective(1rem) rotateX(12deg);
	}

	span:after {
		position: absolute;
		top: 50%;
		content: '';
		bottom: 0;
		transform-origin: center top;
		transform: perspective(1rem) rotateX(-12deg);
	}
`;

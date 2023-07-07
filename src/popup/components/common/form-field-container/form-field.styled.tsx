import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { isMozilla } from '../../../../browser-service';

const perspectiveValues: { [key: string | number]: string } = {
	2: '1.4rem',
	3: '1.8rem',
	4: '2.2rem',
	5: '2.6rem',
	6: '3rem'
};

const topValues: { [key: string | number]: string } = {
	2: '53%',
	3: '52.5%',
	4: '52%',
	5: '51.5%',
	6: '51%'
};

const HexagonBorder = styled.div<{
	theme?: Theme;
	disabled?: boolean | undefined;
	error?: boolean;
	height?: string;
	rows?: number;
}>`
	width: 100%;

	& > span:nth-child(1) {
		position: relative;
		display: flex;
		padding-left: 10px;
		cursor: pointer;
		height: ${({ height }) => height || '40px'};
		font-size: ${({ theme }) => theme.typography.subtitle2.fontSize};
		margin-block: 2px;
		font-weight: 500;
		color: ${({ theme }) => theme.palette.common.black};
		z-index: 100;
	}

	& > span:nth-child(1):before,
	& > span:nth-child(1):after {
		width: 100%;
		content: '';
		position: absolute;
		border: 2px solid
			${({ theme, disabled, error }) =>
				disabled ? theme.palette.secondary.main : error ? theme.palette.error.main : theme.palette.common.white};
		height: 50%;
		left: 0;
		z-index: -1;
		background-color: white;
	}

	& > span:nth-child(1):before {
		border-width: 2px 2px 0 2px;
		top: ${isMozilla ? '1px' : 0};
		transform-origin: center bottom;
		transform: perspective(${({ rows }) => (rows && perspectiveValues[rows]) || '1rem'}) rotateX(3deg);
	}

	& > span:nth-child(1):after {
		position: absolute;
		top: ${({ rows }) => (rows && topValues[rows]) || '55%'};
		content: '';
		border-width: 0 2px 2px 2px;
		bottom: 0;
		transform-origin: center top;
		transform: perspective(${({ rows }) => (rows && perspectiveValues[rows]) || '1rem'}) rotateX(-3deg);
	}
`;

export const Styled = {
	HexagonBorder
};

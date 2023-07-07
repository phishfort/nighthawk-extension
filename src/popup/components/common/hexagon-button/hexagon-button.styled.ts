import styled from '@emotion/styled';
import { COLORS, FONTS, SIZES } from '../../../../common/constants/index';
import { Theme } from '@mui/material';
import { isMozilla } from '../../../../browser-service';

export const ButtonContainer = styled.div<{
	disabled?: boolean;
	width?: string;
	variant?: 'filled' | 'outlined';
	theme?: Theme;
}>`
	position: relative;
	button {
		border: none;
		outline: none;
		background-color: transparent;
		width: 200px;
		height: 40px;
		position: absolute;
		left: 10px;
		top: 0;
		cursor: pointer;
	}
	span {
		position: relative;
		background-image: none !important;
		display: block;
		cursor: pointer;
		width: ${({ width }) => width || SIZES.xxxxxl};
		height: 40px;
		line-height: 45px;
		text-align: center;
		vertical-align: center;
		font-size: ${FONTS.SIZES.m};
		font-family: ${FONTS.FAMILIES.ibmPlexSans};
		font-weight: ${FONTS.WEIGHTS.semi_bold};
		text-decoration: none;
		color: ${({ variant, disabled, theme }) =>
			variant === 'filled' ? theme.palette.primary.contrastText : disabled ? `gray` : theme.palette.common.white};
		z-index: 2;
	}
	span:before,
	span:after {
		width: ${({ width }) => width || SIZES.xxxxxl};
		content: '';
		position: absolute;
		border: 2px solid ${({ disabled }) => (disabled ? `gray` : COLORS.white)};
		height: 50%;
		left: 0;
		z-index: -1;
		background: ${({ variant, theme }) => (variant === 'filled' ? theme.palette.common.white : `none`)};
	}

	span:before {
		border-width: 2px 2px 0 2px;
		top: ${isMozilla ? '1px' : 0};
		transform-origin: center bottom;
		transform: perspective(1rem) rotateX(3deg);
	}
	span:after {
		position: absolute;
		top: calc(50% + 2px);
		content: '';
		border-width: 0 2px 2px 2px;
		bottom: 0;
		transform-origin: center top;
		transform: perspective(1rem) rotateX(-3deg);
	}
`;

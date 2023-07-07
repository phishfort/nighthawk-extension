import styled from '@emotion/styled';
import { Field } from 'formik';
import { Theme } from '@mui/material';

export const Input = styled(Field)`
	outline: none;
	border: 0;
	width: 210px;
	position: absolute;
	top: 12px;
	z-index: 0;
	font-size: 14px;
	margin-left: 10px;
	font-family: 'IBM Plex Sans';
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;

	&:-webkit-autofill {
		-webkit-background-clip: text;
	}
`;

export const ErrorInfoContainer = styled.div<{ errorJustifyContent?: string; theme?: Theme }>`
	display: flex;
	justify-content: flex-end;
	max-width: 250px;
	color: ${({ theme }) => theme.palette.common.white};
	position: relative;
`;

export const ErrorInfoText = styled.div<{ theme?: Theme }>`
	box-sizing: border-box;
	font-size: ${({ theme }) => theme.typography.body2.fontSize};
	font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
	margin-right: ${({ theme }) => theme.spacing(0.5)};
	margin-left: ${({ theme }) => theme.spacing(1)};
	font-family: 'IBM Plex Sans', sans-serif;
`;

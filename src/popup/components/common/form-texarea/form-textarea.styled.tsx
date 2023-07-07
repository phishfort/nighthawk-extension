import styled from '@emotion/styled';
import { Field } from 'formik';
import { Theme } from '@mui/material';
import { isMozilla } from '../../../../browser-service';

export const Textarea = styled(Field)`
	outline: none;
	border: 0;
	width: 210px;
	height: auto;
	z-index: 0;
	font-size: 14px;
	margin-left: 10px;
	padding-top: ${isMozilla ? '12px' : '13px'};
	border: none;
	overflow: hidden;
	-webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
	resize: none;
	background-color: transparent;
	font-family: 'IBM Plex Sans';

	&:-webkit-autofill {
		-webkit-background-clip: text;
	}
`;

export const ErrorInfoContainer = styled.div<{ errorJustifyContent?: string; theme?: Theme }>`
	display: flex;
	justify-content: flex-end;
	width: 90%;
	color: ${({ theme }) => theme.palette.common.white};
	position: relative;
`;

export const ErrorInfoText = styled.div<{ theme?: Theme }>`
	box-sizing: border-box;
	font-size: ${({ theme }) => theme.typography.body2.fontSize};
	font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
	margin-right: ${({ theme }) => theme.spacing(0.25)};
`;

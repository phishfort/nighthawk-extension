import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const ScamReportInput = styled.input<{ theme?: Theme }>`
	outline: none;
	border: 0;
	width: 300px;
	position: absolute;
	top: 15px;
	z-index: 0;
	font-size: ${({ theme }) => theme.typography.body1.fontSize};
	margin-left: ${({ theme }) => theme.spacing(1.25)};
`;

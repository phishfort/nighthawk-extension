import styled from '@emotion/styled';
import { Grid, Theme } from '@mui/material';

export const UrlContainer = styled(Grid)<{ theme?: Theme }>`
	min-height: 44px;
	width: 94.5%;
	border-radius: 4px;
	background-color: ${({ theme }) => theme.palette.common.white};
	margin-bottom: ${({ theme }) => theme.spacing(2.5)};
	padding-top: ${({ theme }) => theme.spacing(0.5)};
	padding-right: ${({ theme }) => theme.spacing(1)};
	padding-bottom: ${({ theme }) => theme.spacing(0.5)};
	word-break: break-all;
`;

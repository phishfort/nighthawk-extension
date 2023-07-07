import { Grid, Theme } from '@mui/material';
import styled from '@emotion/styled';

export const TableContainer = styled(Grid)<{ theme?: Theme }>`
	background-color: ${({ theme }) => theme.palette.common.white};
	position: relative;
	align-items: center;
	justify-content: center;
	min-height: 47px;
	max-width: 256px;
	border-radius: 8px;

	&.table-border {
		border: 2px solid ${({ theme }) => theme.palette.success.main};
		border-radius: 8px;
	}
`;

export const IconWrapper = styled(Grid)`
	position: absolute;
	top: 0;
	right: 0;
	transform: translate(8px, -12px);
`;

export const ImageContainer = styled(Grid)<{ theme?: Theme }>`
	max-width: 220px;
	min-height: 220px;
	border-radius: 4px;
	align-items: center;
	justify-content: center;
	opacity: 1;
	background-color: ${({ theme }) => theme.palette.common.white};
	color: ${({ theme }) => theme.palette.common.black};
`;

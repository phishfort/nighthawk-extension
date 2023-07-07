import styled from '@emotion/styled';
import { Grid, Theme } from '@mui/material';

export const StyledTrustListItem = styled.div<{ theme?: Theme }>`
	display: grid;
	grid-template-columns: 22px 1fr 0fr;
	align-items: center;
	box-sizing: border-box;
	padding-right: ${({ theme }) => theme.spacing(0.25)};
	border-bottom: 1px solid rgba(152, 152, 152, 0.4);
	width: 100%;
	height: 36px;
`;

export const CloseIconContainer = styled(Grid)<{ theme?: Theme }>`
	svg {
		cursor: pointer;
		color: ${({ theme }) => theme.palette.primary.dark};
	}
`;

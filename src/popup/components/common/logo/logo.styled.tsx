import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const StyledLogo = styled.div`
	display: grid;
`;

export const BottomLogoContainer = styled.div<{ theme?: Theme }>`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
	margin-top: ${({ theme }) => theme.spacing(3)};
`;

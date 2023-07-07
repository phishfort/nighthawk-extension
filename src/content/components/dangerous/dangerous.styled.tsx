import styled from '@emotion/styled';
import bgImg from '../../../assets/images/bg-dangerous.png';
import { Grid, Theme } from '@mui/material';

export const DangerousContainer = styled(Grid)`
	background-image: url(${bgImg});
	background-attachment: fixed;
	background-size: cover;
	top: 0;
	left: 0;
	position: fixed;
	min-width: 100vw;
	min-height: 100vh;
	z-index: 9999;
`;

export const Image = styled.img`
	top: 0;
	left: 0;
	position: fixed;
	object-fit: cover;
	min-width: 100vw;
	min-height: 100vh;
	z-index: 9999;
`;

export const BorderBox = styled(Grid)<{ theme?: Theme }>`
	width: auto;
	min-width: 430px;
	min-height: 60px;
	border: 2px solid ${({ theme }) => theme.palette.common.white};
`;

export const PseudoLink = styled.div<{ theme?: Theme }>`
	cursor: pointer;
	& h6 {
		text-decoration: underline;
	}
`;

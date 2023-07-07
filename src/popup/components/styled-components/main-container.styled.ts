import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import bgImg from '../../../assets/images/bg-low-poly-purple.png';
import bgDangerousImg from '../../../assets/images/bg-low-poly-red.png';
import bgValidImg from '../../../assets/images/bg-low-poly-green.png';
import bgUnknownImg from '../../../assets/images/bg-low-poly-gray.png';

const DefaultContainer = styled.div<{ theme?: Theme }>`
	box-sizing: border-box;
	background-size: cover;
	width: 100%;
	min-height: 360px;
	padding-top: ${({ theme }) => theme.spacing(1.5)};
	padding-right: ${({ theme }) => theme.spacing(1.5)};
	padding-bottom: ${({ theme }) => theme.spacing(3.5)};
	padding-left: ${({ theme }) => theme.spacing(1.5)};
	display: flex;
	flex-direction: column;
	overflow: hidden;
	-ms-overflow-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
`;

export const MainContainer = styled(DefaultContainer)<{ theme?: Theme }>`
	background-image: url(${bgImg});
`;

export const DangerousContainer = styled(DefaultContainer)<{ theme?: Theme }>`
	background-image: url(${bgDangerousImg});
`;

export const UnknownContainer = styled(DefaultContainer)<{ theme?: Theme }>`
	background-image: url(${bgUnknownImg});
`;

export const ValidContainer = styled(DefaultContainer)<{ theme?: Theme }>`
	background-image: url(${bgValidImg});
`;

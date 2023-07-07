import styled from '@emotion/styled';
import { Grid, Theme } from '@mui/material';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

export const Hexagon = styled(Grid)<{ theme?: Theme }>`
  width: 96px;
  height: 64px;
  background: ${({ theme }) => theme.palette.common.white};
  position: relative;
  transform: rotate(90deg);

  &::before {
    content: '';
    position: absolute;
    top: -30px;
    border-left: 48px solid transparent;
    border-right: 48px solid transparent;
    border-bottom: 30px solid ${({ theme }) => theme.palette.common.white};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    border-left: 48px solid transparent;
    border-right: 48px solid transparent;
    border-top: 30px solid ${({ theme }) => theme.palette.common.white};
`;
export const PointsCount = styled.div<{ theme?: Theme }>`
	position: absolute;
	top: 8px;
	left: 34px;
	color: ${({ theme }) => theme.palette.primary.contrastText};
	font-size: ${({ theme }) => theme.typography.h3.fontSize};
	font-weight: ${({ theme }) => theme.typography.fontWeightBold};
	transform: rotate(270deg);
`;
export const HexagonLabel = styled(Grid)<{ theme?: Theme }>`
	color: ${({ theme }) => theme.palette.common.white};
	font-size: ${({ theme }) => theme.typography.body1.fontSize};
	font-weight: ${({ theme }) => theme.typography.fontWeightBold};
	display: flex;
	align-items: center;
`;
export const QuestionMarkIcon = styled(AiOutlineQuestionCircle)<{ theme?: Theme }>`
	font-size: ${({ theme }) => theme.typography.subtitle2.fontSize};
	margin-left: ${({ theme }) => theme.spacing(0.75)};
	padding-top: ${({ theme }) => theme.spacing(0.125)};
	&:hover {
		cursor: pointer;
	}
`;
export const Tooltip = styled.div<{ theme?: Theme }>`
	position: relative;
	display: inline-block;
	& .tooltip-body {
		z-index: 999;
		visibility: hidden;
		width: 210px;
		height: 110px;
		top: 100%;
		left: 50%;
		margin-left: -170px;
		font-size: ${({ theme }) => theme.typography.body2.fontSize};
		font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
		color: ${({ theme }) => theme.palette.common.black};
		background-color: ${({ theme }) => theme.palette.common.white};
		text-align: justify;
		padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
		position: absolute;
		border: 1px solid ${({ theme }) => theme.palette.primary.light};
		& p {
			margin-bottom: ${({ theme }) => theme.spacing(2)};
		}
		&::after {
			content: ' ';
			height: 0.5rem;
			width: 0.5rem;
			background-color: ${({ theme }) => theme.palette.common.white};
			position: absolute;
			left: 67%;
			top: -1px;
			border-left: 1px solid ${({ theme }) => theme.palette.primary.light};
			border-top: 1px solid ${({ theme }) => theme.palette.primary.light};
			transform: translate(-50%, -50%) rotate(45deg);
		}
	}
	&:hover .tooltip-body {
		visibility: visible;
	}
`;

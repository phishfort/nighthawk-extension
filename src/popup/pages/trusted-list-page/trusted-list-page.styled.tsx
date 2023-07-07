import styled from '@emotion/styled';
import { COLORS } from '../../../common/constants';

export const StyledTrustListContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100%;

	& > span:nth-child(1) {
		margin-block: 20px;
	}
`;

export const StyledTrustListMainContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100%;

	& > span:nth-child(1) {
		margin-block: 0px 20px;
	}
`;

export const StyledTrustListItemsConatiner = styled.div`
	box-sizing: border-box;
	padding: 5px 15px;
	display: flex;
	flex-direction: column;
	height: fit-content;
	width: 94.5%;
	overflow: hidden;
	background: ${COLORS.white};
	margin-bottom: 15px;
	border-radius: 4px;

	& > div:last-child {
		border: 0 !important;
	}

	&::-webkit-scrollbar {
		display: none;
	}
`;

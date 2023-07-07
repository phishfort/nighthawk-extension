import styled from '@emotion/styled';

export const LinkContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-bottom: 32px;

	& > span {
		margin-block: 5px;
	}

	& > span:nth-child(1) {
		text-align: center;
		letter-spacing: 0.46px;
		text-transform: uppercase;
		opacity: 1;
	}
	& > span:nth-child(2) {
		text-align: center;
		letter-spacing: 0px;
		opacity: 1;
	}
	& > div {
		margin-top: 10px;
	}
`;

export const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 180px;
`;

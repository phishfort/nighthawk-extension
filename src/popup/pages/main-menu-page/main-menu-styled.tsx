import styled from '@emotion/styled';

const StyledMainMenuWrapper = styled.div`
    width: 100%
    height: 100%;
    color: white;
    display: flex;
    flex-direction: column;

	& > div:nth-child(1) {
		padding-inline: 15px
	}

`;

const CentralContainer = styled.div`
	margin-top: 20px;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	color: white;
	display: flex;
	flex-direction: column;
	padding-inline: 40px !important;
`;

const Footer = styled.div`
	a {
		display: block;
		line-height: 1rem;
	}
`;

export const Styled = {
	StyledMainMenuWrapper,
	CentralContainer,
	Footer
};

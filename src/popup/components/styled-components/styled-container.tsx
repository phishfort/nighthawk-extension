import styled from '@emotion/styled';

export const StyledContainer = styled.div<{
	display?: string;
	flexDirection?: string;
	height?: number | string;
	width?: number | string;
	justifyItems?: string;
	justifyContent?: string;
	alignItems?: string;
	padding?: number;
	paddingInline?: number;
	paddingBlock?: number;
}>`
	display: ${({ display }) => display || `grid`};
	width: ${({ width }) => width || `100%`};
	flex-direction: ${({ flexDirection }) => flexDirection || 'row'};
	height: ${({ height }) => height || `100%`};
	justify-items: ${({ justifyItems }) => justifyItems || 'center'};
	justyfy-content: ${({ justifyContent }) => justifyContent || `center`};
	align-items: ${({ alignItems }) => alignItems || 'center'};
	padding: ${({ padding }) => padding || 0}px;
	padding-inline: ${({ paddingInline }) => paddingInline || 0}px;
	padding-block: ${({ paddingBlock }) => paddingBlock || 0}px;
	box-sizing: border-box;
`;

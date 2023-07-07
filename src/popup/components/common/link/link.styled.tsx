import styled from '@emotion/styled';
import { COLORS, FONTS } from '../../../../common/constants';
import { Theme } from '@mui/material';

export const StyledLink = styled.div<{ theme?: Theme }>`
	width: 100%;
	display: flex;
	margin-bottom: 12px;
	box-sizing: border-box;

	& > * {
		width: 100%;
		color: ${COLORS.white};
		text-decoration: none;
		text-align: left;
		font-size: ${FONTS.SIZES.l};
		font-weight: ${FONTS.WEIGHTS.medium};
		font-family: ${FONTS.FAMILIES.ibmPlexSans};
		letter-spacing: 0;
		color: ${({ theme }) => theme.palette.common.white};
		opacity: 1;

		& > * {
			width: 100%;
		}
	}
`;

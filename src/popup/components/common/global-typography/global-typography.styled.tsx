import styled from '@emotion/styled';
import { Typography } from '@mui/material';

export const Text = styled(Typography)<{ opacity?: number }>`
	opacity: ${({ opacity }) => opacity || 1};
`;

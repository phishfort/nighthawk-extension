import styled from '@emotion/styled';
import { TextField, Theme } from '@mui/material';

export const Input = styled(TextField)<{ theme?: Theme }>`
	& .MuiInputBase-root {
		position: absolute;
		top: -10px;
		left: -12px;
		min-width: 238px;
		min-height: 41px;
		padding-top: 0;
		padding-bottom: 0;
		padding-left: 8px;
		font-size: ${({ theme }) => theme.typography.subtitle2.fontSize};
		font-family: 'IBM Plex Sans', sans-serif;
	}

	& #autocomplete-input {
		padding-right: 4px;
	}

	&:-webkit-autofill {
		-webkit-background-clip: text;
	}

	& input::placeholder {
		opacity: 0.75;
	}
`;

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#4d0365',
			dark: '#6C0C8B',
			light: '#BAA6C1',
			contrastText: '#4d0365'
		},
		secondary: {
			main: '#3C3D3ECC',
			dark: '#8E8E8E',
			light: '#989898',
			contrastText: '#3C3D3ECC'
		},
		background: {
			default: '#FFF'
		},
		error: {
			main: '#C30303'
		},
		text: {
			primary: '#3C3D3E'
		}
	},
	typography: {
		fontFamily: ['Roboto', '"IBM Plex Sans"', 'Arial'].join(','),
		h2: {
			fontSize: '3rem',
			fontWeight: 500
		},
		h3: {
			fontSize: '2.25rem',
			fontWeight: 500
		},
		h4: {
			fontSize: '1.375rem',
			fontWeight: 500
		},
		h5: {
			fontSize: '1.25rem',
			fontWeight: 500
		},
		h6: {
			fontSize: '1rem',
			fontWeight: 500
		},
		subtitle1: {
			fontSize: '1.125rem'
		},
		subtitle2: {
			fontSize: '0.875rem',
			fontWeight: 400
		},
		body1: {
			fontSize: '0.75rem'
		},
		body2: {
			fontSize: '0.675rem',
			fontWeight: 400
		},
		caption: {
			fontSize: '0.525rem',
			lineHeight: '0.75rem',
			fontWeight: 400
		}
	}
});

export default theme;

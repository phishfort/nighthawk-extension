import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import './index.css';
import AppPopup from './popup';
import reportWebVitals from './reportWebVitals';
import theme from './common/theme';
import ContentComponent from './content/content';

const IS_DEV_MODE = 'development' === process.env.NODE_ENV;
console.log('\nIS_DEV_MODE:', IS_DEV_MODE);

// TODO need to be change portable module flow in BUILDING moment
(IS_DEV_MODE ? import('./event/store') : import('./common/store'))
	// .then(storeModule => IS_DEV_MODE ? storeModule : storeModule.default.ready())
	.then((storeModule) => {
		console.log('\nstoreModule:', storeModule);
		// @ts-ignore
		const Root = () => (
			<Provider store={storeModule?.default}>
				<ThemeProvider theme={theme}>
					<MemoryRouter>
						{/*<ContentComponent />*/}
						<AppPopup />
					</MemoryRouter>
				</ThemeProvider>
			</Provider>
		);

		ReactDOM.render(
			<React.StrictMode>
				<Root />
			</React.StrictMode>,
			document.getElementById('root')
		);

		// If you want to start measuring performance in your app, pass a function
		// to log results (for example: reportWebVitals(console.log))
		// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
		reportWebVitals();
	});

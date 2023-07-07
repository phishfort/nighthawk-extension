import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../common/store';
import theme from '../common/theme';
import Overload from './components/overload';
import ContentComponent from './content';
import './content.css';
import { browser } from '../browser-service';

const anchor = document.createElement('div');
anchor.id = 'nighthawk-content-anchor';
document.body.insertBefore(anchor, document.body.childNodes[0]);

// @ts-ignore
ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Overload store={store}>
				<ThemeProvider theme={theme}>
					<ContentComponent />
				</ThemeProvider>
			</Overload>
		</Provider>
	</React.StrictMode>,
	document.getElementById('nighthawk-content-anchor')
);

// Hack BG script reload with send message in bg to content script
let port;
function connect() {
	port = browser.runtime.connect({ name: 'foo' });
	port.postMessage('HELLO FROM CONTENT SCRIPT');
	port.onDisconnect.addListener(connect);
	port.onMessage.addListener((msg) => {});
}
connect();

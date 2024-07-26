//@ts-nocheck
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
import Website from '../rule-engine/website';
import { EWebStatus } from '../api/types';
import { SOCIAL_URLS } from '../rule-engine/utils/constants';

const anchor = document.createElement('div');
anchor.id = 'nighthawk-content-anchor';
anchor.style.display = 'none';
document.body.insertBefore(anchor, document.body.childNodes[0]);

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
	port.onMessage.addListener((msg) => { });
}
connect();

// when ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
	const website = new Website(document).toJSON()
	// TODO: avoid check if url is  a social or chrome:// or about: or extension url
	const isValidWebsiteForCheck = !SOCIAL_URLS.includes(website.url) || !website.url.startsWith('chrome://') || !website.url.startsWith('about:') || !website.url.startsWith('moz-extension://');

	if (isValidWebsiteForCheck && website.url) {
		browser.runtime.sendMessage({
			action: 'checkScamByRuleEngine',
			payload: {
				website: website,
				url: document.location.href,
			}
		})
	}
}

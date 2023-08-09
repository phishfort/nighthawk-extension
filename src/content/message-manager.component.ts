import React, { useEffect } from 'react';
import { browser } from '../browser-service';
const allowedOrigins = [process.env.REACT_APP_WEB_URL];

function MessageManager(e: MessageEvent) {
	if (e.source !== window) return;
	if (allowedOrigins.includes(e.origin) === false) return;
	if (e.data.type && e.data.type === process.env.REACT_APP_DANGER_AGREE) {
		const port = browser?.runtime?.connect({ name: process.env.REACT_APP_DANGER_AGREE });
		port.postMessage({ url: e.data.url });
	}

	if (e.data.type && e.data.type === process.env.REACT_APP_TRUSTED_LIST_WEB) {
		const port = browser?.runtime?.connect({ name: process.env.REACT_APP_TRUSTED_LIST_WEB });
		port.postMessage({ shouldUpdateCache: e.data.shouldUpdateCache });
	}
}

const MessageManagerComponent = () => {
	useEffect(() => {
		window.addEventListener('message', MessageManager);
		return () => {
			window.removeEventListener('message', MessageManager);
		};
	}, []);

	return null;
};

export default React.memo(MessageManagerComponent);

import React, { useEffect } from 'react';
import { browser } from '../browser-service';
// const allowedOrigins = [process.env.REACT_APP_WEB_URL, process.env.REACT_APP_NIGHTHAWK_WARNING];

function warningManager(e: MessageEvent) {
	if (e.source !== window) return;
	// if (allowedOrigins.includes(e.origin) === false) return;
	if (e.data.type && e.data.type === process.env.REACT_APP_DANGER_AGREE) {
		const port = browser?.runtime?.connect({ name: process.env.REACT_APP_DANGER_AGREE });
		port.postMessage({ url: e.data.url });
	}
}

const WarningManagerComponent = () => {
	useEffect(() => {
		window.addEventListener('message', warningManager);
		return () => {
			window.removeEventListener('message', warningManager);
		};
	}, []);

	return null;
};

export default React.memo(WarningManagerComponent);

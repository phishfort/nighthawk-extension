import React, { useEffect } from 'react';
import { browser } from '../browser-service';
import { isHttpUrlString, isPlainRecord, isTrustedDashboardMessage } from '../common/utils/extension-origin.util';

export function messageManagerHandler(e: MessageEvent) {
	if (!isTrustedDashboardMessage(e) || !isPlainRecord(e.data) || typeof e.data.type !== 'string') return;
	if (e.data.type === process.env.REACT_APP_DANGER_AGREE && isHttpUrlString(e.data.url)) {
		const port = browser?.runtime?.connect({ name: process.env.REACT_APP_DANGER_AGREE });
		port?.postMessage({ url: e.data.url });
	}

	if (e.data.type === process.env.REACT_APP_TRUSTED_LIST_WEB && typeof e.data.shouldUpdateCache === 'boolean') {
		const port = browser?.runtime?.connect({ name: process.env.REACT_APP_TRUSTED_LIST_WEB });
		port?.postMessage({ shouldUpdateCache: e.data.shouldUpdateCache });
	}
}

const MessageManagerComponent = () => {
	useEffect(() => {
		window.addEventListener('message', messageManagerHandler);
		return () => {
			window.removeEventListener('message', messageManagerHandler);
		};
	}, []);

	return null;
};

export default React.memo(MessageManagerComponent);

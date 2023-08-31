import { wrapStore } from 'webext-redux';
import { PORT_STORE_NAME } from '../common/constants/app-keys.const';
import store from './store';
import { storageService, trustedListService } from '../api/services';
import { setAuthData, signOut } from '../popup/features/store/auth';
import { setActiveTab } from '../content/features/store/source/sourceSlice';
import { browser, isMozilla } from '../browser-service';
import { setGuestGuardianPoints } from '../popup/features/store/user';

browser.runtime.onConnect.addListener(function () {
	console.log('connect!!!');
});

wrapStore(store, {
	portName: PORT_STORE_NAME || undefined
});

console.log('BACKGROUND SCRIPT RUNNING');

console.log('------------------- RELOAD -------------------');

browser.runtime.onInstalled.addListener(function (detail) {
	if (detail.reason === 'update') {
		console.log('EXTENSION UPDATE');
		return;
	}

	browser.tabs.create({
		url: `${process.env.REACT_APP_WEB_URL}/welcome`,
		active: true
	});
});

// redirect to feedback form on uninstalled
browser.runtime.setUninstallURL(process.env.REACT_APP_FEEDBACK_FORM_URL!);

function handleActiveTab() {
	browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		const tab = tabs[0] || {};
		const url = tab.url;
		if (url && store.getState().source.activeTab !== url) {
			store.dispatch(setActiveTab(url));
		}
	});
}

browser.tabs.onActivated.addListener(handleActiveTab);
browser.tabs.onUpdated.addListener(handleActiveTab);

browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.newIconPath) {
		browser.action.setIcon({
			path: msg.newIconPath,
			tabId: sender?.tab?.id
		});
	}
	sendResponse({});
	return true;
});

browser.runtime.onConnect.addListener((port) => {
	if (port.name === process.env.REACT_APP_WEB_LOGIN) {
		port.onMessage.addListener((msg) => {
			console.log('\n message =>', msg);

			if (msg.isGuest) {
				storageService.setGuestTokenToStorage(msg.token);
				store.dispatch(
					setAuthData({
						token: msg.token,
						isVerified: false
					})
				);
			} else {
				storageService.setTokenToStorage(msg.token);
				storageService.removePointsFromStorage();
				store.dispatch(setGuestGuardianPoints(null));
				store.dispatch(
					setAuthData({
						token: msg.token,
						isVerified: true
					})
				);
			}
		});
	}

	if (port.name === process.env.REACT_APP_WEB_LOGOUT) {
		console.log('REMOVE TOKEN');
		store.dispatch(signOut());
		storageService.removeTokensFromStorage();
	}

	if (port.name === process.env.REACT_APP_WEB_GUARDIAN_POINTS) {
		port.onMessage.addListener((msg) => {
			storageService.setPointsToStorage(msg.points);
		});
	}

	if (port.name === process.env.REACT_APP_DANGER_AGREE) {
		port.onMessage.addListener((msg) => {
			storageService.setDangerAgreeListToStorage(msg.url);
		});
	}
	if (port.name === process.env.REACT_APP_TRUSTED_LIST_WEB) {
		port.onMessage.addListener((msg) => {
			if (msg.shouldUpdateCache) {
				storageService.removeTrustedListFromStorage();
			}
		});
	}

	if (port.name === process.env.REACT_APP_LOAD_NIGHTHAWK_LIST) {
		port.onMessage.addListener(async (msg) => {
			const nighthawkList = await storageService.getNighthawkListFromStorage();
			if (!nighthawkList) {
				const resp = await fetch(process.env.REACT_APP_CDN_URL!)
					.then((res) => res.json())
					.catch((err) => {
						console.log(err);
					});
				storageService.setNighthawkListToStorage(resp);
			}
		});
	}
	if (port.name === process.env.REACT_APP_LOAD_TRUST_LIST) {
		port.onMessage.addListener(async (msg) => {
			const trustedList = await storageService.getTrustedListFromStorage();
			if (!trustedList) {
				const resp = await trustedListService.getAllTrustedList();
				if (!resp) return;
				storageService.setTrustedListToStorage(resp);
			}
		});
	}
});

// Hack BG script reload with send message in bg to content script
interface IPort extends browser.runtime.Port {
	_timer?: ReturnType<typeof setTimeout>;
}

function onMessage(msg: any, port: browser.runtime.Port) {
	console.log('received', msg, 'from', port.sender);
}
function forceReconnect(port: browser.runtime.Port) {
	deleteTimer(port);
	port.disconnect();
}
function deleteTimer(port: IPort) {
	if (port._timer) {
		clearTimeout(port._timer);
		delete port._timer;
	}
}

if (!isMozilla) {
	browser.runtime.onConnect.addListener((port: any) => {
		if (port.name !== 'foo') return;
		console.log('PORT = foo', port.name === 'foo');

		port.postMessage('HELLO FROM BG SCRIPT');
		port.onMessage.addListener(onMessage);
		port.onDisconnect.addListener(deleteTimer);
		port._timer = setTimeout(forceReconnect, 4 * 1000 * 60, port);
	});
}

import { wrapStore } from 'webext-redux';
import { PORT_STORE_NAME } from '../common/constants/app-keys.const';
import store from './store';
import { scamReportService, storageService } from '../api/services';
import { setAuthData, signOut } from '../popup/features/store/auth';
import { setActiveTab, getActiveTab } from '../content/features/store/source/sourceSlice';
import { browser, isMozilla } from '../browser-service';
import { setGuestGuardianPoints } from '../popup/features/store/user';
import { REFETCH_TIME, getValidUrl } from '../api/utils/validate-url';
import { EType, EWebStatus } from '../api/types';
import { getUrlType, pattern } from '../popup/utils';
import axios from 'axios';

browser.runtime.onConnect.addListener(function () {
	console.log('connect!!!');
});

wrapStore(store, {
	portName: PORT_STORE_NAME || undefined
});

console.log('BACKGROUND SCRIPT RUNNING');

console.log('------------------- RELOAD -------------------');

browser.runtime.onInstalled.addListener(function (detail) {
	if (detail.reason === 'install') {
		browser.tabs.create({
			url: `${process.env.REACT_APP_WEB_URL}/welcome`,
			active: true
		});

		loadLists()
			.then(() => {
				console.log('SUCCESS LOADED LISTS ON INSTALL');
			})
			.catch(() => {
				console.log('FAILED TO LOAD LISTS ON INSTALL');
			});
	}

	return;
});

// redirect to feedback form on uninstalled
browser.runtime.setUninstallURL(process.env.REACT_APP_FEEDBACK_FORM_URL!);

browser.webNavigation.onBeforeNavigate.addListener(async ({ url, tabId, frameId }) => {
	if (frameId !== 0) return;
	if (getUrlType(url) !== EType.WEBSITE) {
		browser.action.setIcon({
			path: `/assets/logo/ic-nighthawk-trusted.png`,
			tabId
		});
		return;
	}
	if (pattern.test(url)) {
		browser.action.setIcon({
			path: `/assets/logo/ic-nighthawk-dangerous.png`,
			tabId
		});
		return;
	}

	const isListLoaded = await storageService.getNighthawkListFromStorage();
	const dangerAgreeList = await storageService.getDangerAgreeListFromStorage();
	const isDangerAgree = dangerAgreeList?.some((dangerUrl: string) => dangerUrl.includes(getValidUrl(url))) || false;
	if (!isListLoaded) {
		await loadLists();
		return;
	}

	const status = await scamReportService.checkScam({ url });
	if (!status?.status) return;
	if (status.status === EWebStatus.DANGEROUS) {
		browser.action.setIcon({
			path: `/assets/logo/ic-nighthawk-dangerous.png`,
			tabId
		});
		if (!isDangerAgree) {
			browser.tabs.update(tabId, {
				url: `warning.html?url=${url}`
			});
		}
		return;
	}
	if (!isMozilla && status.status === EWebStatus.SAFE) {
		browser.action.setIcon({
			path: `/assets/logo/ic-nighthawk-trusted.png`,
			tabId
		});
		return;
	}
});

browser.webNavigation.onCompleted.addListener(async ({ url, tabId, frameId }) => {
	if (frameId !== 0) return;
	if (getUrlType(url) !== EType.WEBSITE) {
		browser.action.setIcon({
			path: `/assets/logo/ic-nighthawk-trusted.png`,
			tabId
		});
		return;
	}
	if (pattern.test(url)) {
		browser.action.setIcon({
			path: `/assets/logo/ic-nighthawk-dangerous.png`,
			tabId
		});
		return;
	}

	const isListLoaded = await storageService.getNighthawkListFromStorage();
	if (!isListLoaded) {
		await loadLists();
		return;
	}

	const status = await scamReportService.checkScam({ url });
	if (!status?.status) return;

	if (status.status === EWebStatus.DANGEROUS) {
		browser.action.setIcon({
			path: `/assets/logo/ic-nighthawk-dangerous.png`,
			tabId
		});
		return;
	}
	if (status.status === EWebStatus.SAFE) {
		browser.action.setIcon({
			path: `/assets/logo/ic-nighthawk-trusted.png`,
			tabId
		});
		return;
	}
});

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
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	handleActiveTab();
	if (tab.active || changeInfo.url || changeInfo.status === 'complete') {
		const url = tab.url as string;

		if (pattern.test(url)) {
			browser.action.setIcon({
				path: `/assets/logo/ic-nighthawk-dangerous.png`,
				tabId
			});
			return;
		}
	}
});

browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.newIconPath) {
		browser.action.setIcon({
			path: msg.newIconPath,
			tabId: sender?.tab?.id
		});
	}
	if (msg.action === 'loadLists') {
		loadLists()
			.then((lists) => {
				sendResponse(lists);
				console.log('FINISHED LOADING LIST ON EXTENSION REQUEST');
			})
			.catch(() => {
				console.log('FAILED TO LOAD LISTS ON EXTENSION REQUEST');
			});
		return true;
	}

	if (msg.action === 'refetchLists') {
		loadLists()
			.then((lists) => {
				sendResponse(lists);
				console.log('FINISHED REFETCHING LIST ON EXTENSION REQUEST');
			})
			.catch(() => {
				console.log('FAILED TO REFETCH LISTS ON EXTENSION REQUEST');
			});
		return true;
	}

	if (msg.action === 'setDangerUrl') {
		const { url } = msg;
		storageService.setDangerAgreeListToStorage(url);
	}

	sendResponse({});
	return true;
});

browser.runtime.onConnect.addListener(async (port) => {
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
		store.dispatch(signOut());
		await storageService.removeTokensFromStorage();
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
		port.onMessage.addListener(async (msg) => {
			if (msg.shouldUpdateCache) {
				await storageService.removeTrustedListFromStorage();
				loadLists()
					.then(() => {
						console.log('SUCCESS LOADED LISTS ON WEB REQUEST');
					})
					.catch(() => {
						console.log('FAILED TO LOAD LISTS ON WEB REQUEST');
					});
			}
		});
	}

	if (port.name === process.env.REACT_APP_LOAD_NIGHTHAWK_LIST) {
		port.onMessage.addListener(async (msg) => {
			if (msg.shouldLoadLists) {
				loadLists();
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

// Refetch lists on interval
setInterval(async () => {
	console.log('REFETCH NIGHTHAWK LISTS');
	await storageService.removeNighthawkLists();

	loadLists()
		.then(() => {
			console.log('REFETCH NIGHTHAWK LISTS SUCCESSFULLY');
		})
		.catch(() => console.log('Error REFETCH NIGHTHAWK LISTS'));
}, REFETCH_TIME);

async function loadLists() {
	const token = await storageService.getTokenFromStorage();
	Promise.all([storageService.getNighthawkListFromStorage(), storageService.getTrustedListFromStorage()]).then(
		async (res) => {
			let nighthawkList = res[0];
			let trustedList = res[1];

			if (!nighthawkList) {
				const resp = await fetch(process.env.REACT_APP_CDN_URL!, {
					headers: {
						'x-api-key': process.env.REACT_APP_NIGHTHAWK_API_KEY!
					}
				})
					.then((res) => res.json())
					.catch(() => {
						console.log("CAN'T LOAD NIGHTHAWK LIST");
					});
				nighthawkList = resp;
				storageService.setNighthawkListToStorage(resp);
			}

			if (!trustedList && token) {
				const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/my-trusted`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
					.then((res) => res.json())
					.catch(() => {
						console.log("CAN'T LOAD TRUSTED LIST");
					});
				trustedList = resp;
				storageService.setTrustedListToStorage(resp);
			}

			return {
				nighthawkList,
				trustedList
			};
		}
	);
}

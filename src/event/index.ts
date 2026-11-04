import { wrapStore } from 'webext-redux';
import { PORT_STORE_NAME } from '../common/constants/app-keys.const';
import store from './store';
import { scamReportService, storageService } from '../api/services';
import { invalidateAuthRequests, setAuthData, signOut } from '../popup/features/store/auth';
import { setActiveTab } from '../content/features/store/source/sourceSlice';
import { browser, isMozilla } from '../browser-service';
import { setGuestGuardianPoints } from '../popup/features/store/user';
import { REFETCH_TIME } from '../api/utils/validate-url';
import { EWebStatus } from '../api/types';
import { pattern } from '../common/utils/warning-url.util';
import { Website } from '../rule-engine/types';
import {
	getGuardianPoints,
	isDashboardUrl,
	isExtensionPageUrl,
	isHttpUrlString,
	isPlainRecord,
	isValidToken
} from '../common/utils/extension-origin.util';

function isHttpNavigationUrl(value: unknown): value is string {
	if (typeof value !== 'string') return false;
	try {
		return ['http:', 'https:'].includes(new URL(value).protocol);
	} catch {
		return false;
	}
}

let accountUpdate = Promise.resolve();

function updateAccount(operation: () => Promise<void>): Promise<void> {
	const pending = accountUpdate.then(operation);
	accountUpdate = pending.catch(() => {
		console.warn('Account update failed');
	});
	return pending;
}

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

		loadRules()
			.then(() => {
				console.log('SUCCESS LOADED RULES ON INSTALL');
			})
			.catch(() => {
				console.log('FAILED TO LOAD RULES ON INSTALL');
			});
	}

	return;
});

// redirect to feedback form on uninstalled
browser.runtime.setUninstallURL(process.env.REACT_APP_FEEDBACK_FORM_URL!);

browser.webNavigation.onBeforeNavigate.addListener(async ({ url, tabId, frameId }) => {
	if (frameId !== 0) return;
	if (pattern.test(url)) {
		browser.action.setIcon({
			path: `/assets/logo/ic-nighthawk-dangerous.png`,
			tabId
		});
		return;
	}
	if (!isHttpNavigationUrl(url)) return;

	const isListLoaded = await storageService.getNighthawkListFromStorage();
	const isDangerAgree = await storageService.isDangerUrlAgreed(url);
	if (!isListLoaded) {
		await loadLists();
	}

	const status = await scamReportService.checkScam({ url });
	if (!status?.status) return;
	if (status.status === EWebStatus.DANGEROUS) {
		browser.action.setIcon({
			path: `/assets/logo/ic-nighthawk-dangerous.png`,
			tabId
		});
		if (!isDangerAgree) {
			const encodedUrl = encodeURIComponent(url);
			browser.tabs.update(tabId, {
				url: `warning.html?url=${encodedUrl}&detected-by=nighthawk`
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
	if (pattern.test(url)) {
		browser.action.setIcon({
			path: `/assets/logo/ic-nighthawk-dangerous.png`,
			tabId
		});
		return;
	}
	if (!isHttpNavigationUrl(url)) return;

	const isListLoaded = await storageService.getNighthawkListFromStorage();
	if (!isListLoaded) {
		await loadLists();
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
	if (sender.id !== browser.runtime.id || !isPlainRecord(msg)) return false;
	if (
		typeof msg.newIconPath === 'string' &&
		/^\/assets\/logo\/ic-nighthawk-(trusted|dangerous|unknown)\.png$/.test(msg.newIconPath)
	) {
		browser.action.setIcon({
			path: msg.newIconPath,
			tabId: sender?.tab?.id
		});
	}
	if (msg.action === 'loadLists') {
		loadLists()
			.then((lists) => {
				sendResponse(lists);
			})
			.catch(() => {
				console.log('FAILED TO LOAD LISTS ON EXTENSION REQUEST');
				sendResponse({});
			});
		return true;
	}

	if (msg.action === 'refetchLists') {
		loadLists()
			.then((lists) => {
				sendResponse(lists);
			})
			.catch(() => {
				console.log('FAILED TO REFETCH LISTS ON EXTENSION REQUEST');
				sendResponse({});
			});
		return true;
	}

	if (msg.action === 'setDangerUrl') {
		if (isExtensionPageUrl(sender.url, browser.runtime.getURL('warning.html')) && isHttpUrlString(msg.url)) {
			storageService.setDangerAgreeListToStorage(msg.url).then(() => sendResponse({}));
			return true;
		}
		return false;
	}

	if (msg.action === 'loadRules') {
		loadRules()
			.then((rules) => {
				sendResponse({ rules });
			})
			.catch(() => {
				console.log('FAILED TO LOAD RULES ON EXTENSION REQUEST');
				sendResponse({ rules: [] });
			});
		return true;
	}

	if (msg.action === 'checkScamByRuleEngine') {
		if (
			sender.frameId === 0 &&
			typeof sender.tab?.id === 'number' &&
			isHttpNavigationUrl(sender.url) &&
			isPlainRecord(msg.payload) &&
			isPlainRecord(msg.payload.website)
		) {
			const website = msg.payload.website as unknown as Website;
			const url = sender.url;
			const tabId = sender.tab.id;
			loadRules()
				.then(() => {
					return handleFlaggedSites(website, url, tabId);
				})
				.catch(() => {
					console.log('FAILED TO LOAD RULES ON EXTENSION REQUEST');
				});
		}

		return true;
	}
	sendResponse({});
	return true;
});

browser.runtime.onConnect.addListener(async (port) => {
	// The port name is public; authorize the browser-supplied sender independently.
	if (
		port.sender?.id !== browser.runtime.id ||
		!isDashboardUrl(port.sender?.url) ||
		(port.sender.frameId !== undefined && port.sender.frameId !== 0)
	)
		return;
	if (port.name === process.env.REACT_APP_WEB_LOGIN) {
		port.onMessage.addListener(async (msg) => {
			if (!isPlainRecord(msg) || !isValidToken(msg.token) || typeof msg.isGuest !== 'boolean') return;
			// Cancel automatic guest requests at intent time, before any storage awaits.
			store.dispatch(invalidateAuthRequests());
			const token = msg.token;
			const isGuest = msg.isGuest;
			return updateAccount(async () => {
				if (isGuest) {
					await storageService.removeTokensFromStorage();
					if (!(await storageService.setGuestTokenToStorage(token))) return;
					store.dispatch(
						setAuthData({
							token,
							isVerified: false
						})
					);
				} else {
					await storageService.setTokenToStorage(token);
					await storageService.removePointsFromStorage();
					store.dispatch(setGuestGuardianPoints(null));
					store.dispatch(
						setAuthData({
							token,
							isVerified: true
						})
					);
				}
			});
		});
	}

	if (port.name === process.env.REACT_APP_WEB_LOGOUT) {
		store.dispatch(invalidateAuthRequests());
		await updateAccount(async () => {
			await storageService.removeTokensFromStorage();
			store.dispatch(signOut());
		});
	}

	if (port.name === process.env.REACT_APP_WEB_GUARDIAN_POINTS) {
		port.onMessage.addListener((msg) => {
			if (!isPlainRecord(msg)) return;
			const points = getGuardianPoints(msg.points);
			if (points !== null) storageService.setPointsToStorage(String(points));
		});
	}

	if (port.name === process.env.REACT_APP_DANGER_AGREE) {
		port.onMessage.addListener((msg) => {
			if (isPlainRecord(msg) && isHttpUrlString(msg.url)) storageService.setDangerAgreeListToStorage(msg.url);
		});
	}
	if (port.name === process.env.REACT_APP_TRUSTED_LIST_WEB) {
		port.onMessage.addListener(async (msg) => {
			if (isPlainRecord(msg) && msg.shouldUpdateCache === true) {
				await storageService.removeTrustedListFromStorage();
				await loadLists();
			}
		});
	}

	if (port.name === process.env.REACT_APP_LOAD_NIGHTHAWK_LIST) {
		port.onMessage.addListener(async (msg) => {
			if (isPlainRecord(msg) && msg.shouldLoadLists === true) {
				await loadLists();
			}
		});
	}
});

// Hack BG script reload with send message in bg to content script
interface IPort extends browser.runtime.Port {
	_timer?: ReturnType<typeof setTimeout>;
}

function onMessage(msg: any, port: browser.runtime.Port) {
	// console.log('received', msg, 'from', port.sender);
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
		// console.log('PORT = foo', port.name === 'foo');

		port.postMessage('HELLO FROM BG SCRIPT');
		port.onMessage.addListener(onMessage);
		port.onDisconnect.addListener(deleteTimer);
		port._timer = setTimeout(forceReconnect, 4 * 1000 * 60, port);
	});
}

// Refetch lists on interval
setInterval(async () => {
	try {
		await storageService.removeNighthawkLists();
		await loadLists();
		console.log('Lists Re-fetched successfully');
	} catch (error) {
		console.log('Error refetching lists');
	}
}, REFETCH_TIME);

export async function loadLists() {
	const token = await storageService.getTokenFromStorage();
	return Promise.all([storageService.getNighthawkListFromStorage(), storageService.getTrustedListFromStorage()]).then(
		async (res) => {
			let nighthawkList = res[0];
			let trustedList = res[1];

			if (!nighthawkList) {
				const resp = await fetch(process.env.REACT_APP_CDN_URL!, {
					headers: {
						'x-api-key': process.env.REACT_APP_NIGHTHAWK_API_KEY!
					}
				})
					.then((res) => {
						if (!res.ok) throw new Error('List request failed');
						return res.json();
					})
					.catch(() => {
						console.log("CAN'T LOAD NIGHTHAWK LIST");
					});
				nighthawkList = resp;
				if (resp) await storageService.setNighthawkListToStorage(resp);
			}

			if (!trustedList && token) {
				const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/my-trusted`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
					.then((res) => {
						if (!res.ok) throw new Error('Trusted-list request failed');
						return res.json();
					})
					.catch(() => {
						console.log("CAN'T LOAD TRUSTED LIST");
					});
				if (Array.isArray(resp)) {
					await storageService.setTrustedListToStorage(resp, token);
					trustedList = resp;
				}
			}
			// An old authenticated response must not be returned to a newer session.
			if ((await storageService.getTokenFromStorage()) !== token) trustedList = undefined;

			return {
				nighthawkList,
				trustedList
			};
		}
	);
}

export async function loadRules() {
	try {
		const rules = await storageService.getRulesFromStorage();
		if (rules?.length) return rules;

		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rules`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': process.env.REACT_APP_NIGHTHAWK_API_KEY!
			}
		});

		if (response.ok) {
			const data = await response.json();
			storageService.setRulesToStorage(data.rules);
			return data.rules;
		}

		return [];
	} catch (error) {
		console.log('Error fetching rules', error);
	}
}

export async function handleFlaggedSites(website: Website, url: string, tabId: number) {
	try {
		const response = await scamReportService.checkScam({ url, requestFrom: 'ruleEngine', website });
		const isDangerAgree = await storageService.isDangerUrlAgreed(url);

		if (!response?.status) return;
		if (response.status === EWebStatus.DANGEROUS) {
			browser.action.setIcon({
				path: `/assets/logo/ic-nighthawk-dangerous.png`,
				tabId
			});
			if (!isDangerAgree) {
				const encodedUrl = encodeURIComponent(url);
				browser.tabs.update(tabId, {
					url: `warning.html?url=${encodedUrl}&detected-by=rule-engine`
				});
			}
			return;
		}
	} catch (error) {
		console.log('Error checking scam by rule engine');
	}
}

// Fetch rules every 12 hours
const HourInterval = 1000 * 60 * 60 * 12;
setInterval(async () => {
	try {
		await storageService.removeRulesFromStorage();
		const rules = await loadRules();
		if (rules.length) storageService.setRulesToStorage(rules);
		console.log('Rules Re-fetched successfully');
	} catch (error) {
		console.log('Error fetching rules');
	}
}, HourInterval);

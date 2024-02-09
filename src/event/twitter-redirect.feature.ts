import { browser, isMozilla } from '../browser-service';

const TWITTER_UA = 'Twitterbot/1.0';

const getExpandedTCORedirectLink = async (tcoUrl: string) => {
	try {
		const resp = await fetch(tcoUrl, {
			method: 'GET',
			redirect: 'manual'
		});

		if (resp.ok) {
			const data = await resp.text();
			const url = data.match(/<meta\s+http-equiv="refresh"\s+content="0;URL=([^"]+)"/i);
			if (url && url[0]) {
				const expandedTCOLink = url[0].split('URL=')[1].replace(/"/g, '');
				return expandedTCOLink;
			}
		} else if (resp.status === 301 || resp.status === 302) {
			const expandedTCOLink = resp.headers.get('Location');
			return expandedTCOLink;
		}
	} catch (error) {
		throw new Error('Error expanding t.co link' + error);
	}
};

const getV3Rules = (userAgent: string) => {
	const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);
	const rules: chrome.declarativeNetRequest.Rule[] = [
		{
			id: 1,
			priority: 1,
			action: {
				type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
				requestHeaders: [
					{
						operation: chrome.declarativeNetRequest.HeaderOperation.SET,
						header: 'User-Agent',
						value: userAgent
					}
				]
			},
			condition: {
				resourceTypes: allResourceTypes
			}
		}
	];

	return rules;
};

async function setUserAgentHeader(userAgent: string) {
	if (!isMozilla) {
		const rules = getV3Rules(userAgent);
		await browser.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: rules.map((rule) => rule.id),
			addRules: rules
		});
	} else {
		browser.webRequest.onBeforeSendHeaders.addListener(
			(details) => {
				details?.requestHeaders?.push({ name: 'User-Agent', value: userAgent });
				return { requestHeaders: details.requestHeaders };
			},
			{ urls: ['<all_urls>'] },
			['blocking', 'requestHeaders']
		);
	}
}

async function removeUserAgentHeader(userAgent: string) {
	if (!isMozilla) {
		const rules = getV3Rules(userAgent);
		await browser.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: rules.map((rule) => rule.id)
		});
	} else {
		browser.webRequest.onBeforeSendHeaders.addListener(
			(details) => {
				details.requestHeaders = details?.requestHeaders?.filter((header) => header.name !== 'User-Agent');
				return { requestHeaders: details.requestHeaders };
			},
			{ urls: ['<all_urls>'] },
			['blocking', 'requestHeaders']
		);
	}
}

async function getTwitterBotRedirectLink(expandedTCOLink: string) {
	try {
		if (!expandedTCOLink) throw new Error('No link provided');
		await setUserAgentHeader(TWITTER_UA);
		const resp = await fetch(expandedTCOLink, {
			method: 'GET'
		});

		const twitterBotRedirectLink = resp.headers.get('Location') || resp.url;

		return twitterBotRedirectLink;
	} catch (error) {
		console.log('ERROR GETTING Twitter Bot REDIRECT', error);
		return null;
	}
}

async function getUserRedirectLink(expandedTCOLink: string) {
	try {
		await removeUserAgentHeader(TWITTER_UA);
		const response = await fetch(expandedTCOLink, {
			method: 'GET'
		});
		const userRedirectLink = response.headers.get('Location') || response.url;

		return userRedirectLink;
	} catch (error) {
		console.log('ERROR GETTING USER REDIRECT', error);
		return null;
	}
}
const compareRedirectLinks = async (expandedTCOLink: string) => {
	try {
		const twitterBotRedirectLink = await getTwitterBotRedirectLink(expandedTCOLink);
		const userRedirectLink = await getUserRedirectLink(expandedTCOLink);

		if (twitterBotRedirectLink === userRedirectLink)
			return {
				isScam: false,
				reason: ''
			};
		else if (twitterBotRedirectLink && userRedirectLink) {
			const reason = `Different redirect: ${twitterBotRedirectLink?.slice(0, 30)} vs ${userRedirectLink.slice(0, 30)}`;
			return {
				isScam: true,
				reason
			};
		} else if (twitterBotRedirectLink && !userRedirectLink) {
			return {
				isScam: true,
				reason: 'The link is a Potential Twitter redirect scam!'
			};
		}
	} catch (error) {
		console.log('ERROR CHALLENGING LINK', error);
		return {
			isScam: false,
			reason: ''
		};
	}
};

export const checkTwitterRedirectScam = async (link: string) => {
	let expandedTCOLink = link;
	if (link.includes('t.co')) expandedTCOLink = (await getExpandedTCORedirectLink(link)) as string;
	const resp = await compareRedirectLinks(expandedTCOLink as string);

	if (resp) return resp;
	return {
		isScam: false,
		reason: ''
	};
};

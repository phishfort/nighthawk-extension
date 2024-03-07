import { storageService } from '../api/services';

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

const compareRedirectLinks = async (expandedTCOLink: string, fromTwitter: string) => {
	try {
		const userRedirectLink = expandedTCOLink;
		const twitterHost = fromTwitter.trim();
		const userHost = new URL(userRedirectLink).host;

		if (!userHost.includes(twitterHost)) {
			const reason = `Redirect Link: ${twitterHost} vs ${userHost}`;
			return {
				isScam: true,
				reason
			};
		} else if (twitterHost && !userHost) {
			return {
				isScam: true,
				reason: 'The link is a potential Twitter redirect scam!'
			};
		}

		return {
			isScam: false,
			reason: ''
		};
	} catch (error) {
		console.log('ERROR CHALLENGING LINK', error);
		return {
			isScam: false,
			reason: ''
		};
	}
};

export const checkTwitterRedirectScam = async (msg: IMSGfromTwitter) => {
	try {
		const twitterRedirectUrl = msg.fromTwitter.trim();
		let userRedirectUrl = msg.url;
		const shortUrls = await getShortUrls();

		if (userRedirectUrl.includes('t.co')) {
			userRedirectUrl = (await getExpandedTCORedirectLink(userRedirectUrl)) as string;
		}
		if (twitterRedirectUrl.split('.').length < 2 || !userRedirectUrl) return { isScam: false, reason: '' };
		const host = new URL(userRedirectUrl).host;
		if (shortUrls.includes(host)) {
			userRedirectUrl = (await getExpandedTCORedirectLink(userRedirectUrl)) as string;
		}

		const resp = await compareRedirectLinks(userRedirectUrl, twitterRedirectUrl);
		if (resp) return resp;
		return {
			isScam: false,
			reason: ''
		};
	} catch (error) {
		console.log('ERROR CHECKING TWITTER REDIRECT SCAM', error);
		return {
			isScam: false,
			reason: ''
		};
	}
};

export const getShortUrls = async () => {
	let shortUrls = await storageService.getShortUrlsFromStorage();
	if (!shortUrls) {
		const resp = await fetch('https://cdn.jsdelivr.net/gh/PeterDaveHello/url-shorteners/list');
		const data = await resp.text();
		shortUrls = data.split('\n').filter((el) => el !== '' && !el.startsWith('#'));

		storageService.setShortUrlsToStorage(shortUrls);
	}

	return shortUrls;
};

// invalidate short urls cache every 24 hours
setInterval(() => {
	storageService.removeShortUrlsFromStorage();
}, 1000 * 60 * 60 * 24);

export interface IMSGfromTwitter {
	url: string;
	fromTwitter: string;
}

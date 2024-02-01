import { EWebStatus } from '../../../api/types';
import { createIconBadge } from '../../utils/icon.util';
import axios from 'axios';

export const createTwitterIcon = (type: EWebStatus, block: Element) => {
	const icon = createIconBadge(type, {
		width: 18,
		height: 18,
		fontSize: 11,
		pt: 1
	});

	const name = block as HTMLElement;
	name.style.display = 'flex';
	name.style.alignItems = 'center';
	name.append(icon);
};

export const getTweeterAcc = (pathname: string) => {
	return pathname.split('/').filter(Boolean)[0];
};

export const getTweetAuthorAcc = (pathname: string) => {
	const arr = pathname.split('/').filter(Boolean);
	return arr[arr.length - 1];
};

const expandTcoLink = async (tcoUrl: string) => {
	const headers = { 'User-Agent': 'Twitterbot/1.0' };
	const options = {
		url: tcoUrl,
		headers: headers,
		followRedirect: false,
		timeout: 5000
	};

	try {
		const resp = await axios(options);
		const { data, headers } = resp;

		if (data) {
			const url = data.match(/"(http|https):\/\/[^"]+"/g);
			if (url && url.length > 0) {
				return url[0].replace(/"/g, '');
			} else {
				return tcoUrl;
			}
		} else if (headers.location) return headers.location;
	} catch (error) {
		console.error(error);
		return tcoUrl;
	}
};

const challengeLink = async (unwrappedLink: string) => {
	const headers = { 'User-Agent': 'Twitterbot/1.0' };
	const options = {
		url: unwrappedLink,
		headers: headers,
		followRedirect: false,
		timeout: 5000
	};

	try {
		if (!unwrappedLink) throw new Error('No link provided');
		const resp = await axios(options);
		const referenceRedirect = resp.headers.location;
		const normalHeaders = {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
		};
		const normalOptions = {
			url: unwrappedLink,
			headers: normalHeaders,
			followRedirect: false,
			timeout: 5000
		};
		const normalResp = await axios(normalOptions);
		const newRedirect = normalResp.headers.location;
		if (referenceRedirect === newRedirect) return false;
		else if (referenceRedirect && newRedirect) {
			// Response has changed, flag
			// implement additional check if the domain is in PF whitelist
			const out = `${unwrappedLink.slice(0, 30)} is a Twitter redirect scam! (${referenceRedirect?.slice(
				0,
				30
			)} vs ${newRedirect.slice(0, 30)})`;
			console.log(out);
			return true;
		} else {
			// TODO: implement additional check if the domain is in PF whitelist
			// A previously redirecting link stopped redirecting, flag
			const out = `${unwrappedLink} has stopped redirecting, suspicious behavior.`;
			console.log(out);
			return true;
		}
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const checkTwitterRedirect = async (link: string) => {
	const unwrappedLink = await expandTcoLink(link);
	const resp = await challengeLink(unwrappedLink);

	return true;
};

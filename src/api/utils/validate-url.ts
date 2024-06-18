export function getValidUrl(url: string): string {
	const socials = ['youtube.com', 'twitter.com', 'facebook.com', 'linkedin.com'];
	let validUrl = url;
	if (validUrl.endsWith('/')) {
		validUrl = validUrl.slice(0, -1);
	}

	if (validUrl.startsWith('/')) {
		validUrl = validUrl.slice(1);
	}

	// remove www.
	if (validUrl.includes('www.')) {
		validUrl = validUrl.replace('www.', '');
	}

	// socials
	if (socials.some((social) => validUrl.includes(social))) {
		// make url complete
		if (!validUrl.includes('://')) {
			validUrl = 'https://' + validUrl;
		}

		let pathname = '';
		let searchParams = new URLSearchParams();
		try {
			const urlObj = new URL(validUrl);
			pathname = urlObj.pathname;
			searchParams = urlObj.searchParams;
		} catch (error) {
			console.log('Error in getValidUrl', error);
			return validUrl;
		}

		// facebook
		if (validUrl.includes('facebook.com')) {
			if (searchParams.has('id')) {
				const id = searchParams.get('id');
				if (id) {
					return id;
				}
			}

			// look for id in group/, page/, people/ ...
			const regexToFindId = /(?<=\/)(\d{14,})(?=\/|$)/;
			const id = pathname.match(regexToFindId);
			if (id && id[0]) {
				return id[0];
			}

			// look for username in group/, page/, people/ ...
			const keyWords = ['groups', 'pages', 'people', 'events', 'marketplace', 'media', 'set', 'p'];
			const arr = pathname.split('/').filter((el) => el && !keyWords.includes(el));
			if (arr.length) {
				return arr[0];
			}
			return validUrl;
		}

		// youtube
		if (validUrl.includes('youtube.com')) {
			// channel
			if (
				pathname.startsWith('/channel/') ||
				pathname.startsWith('/c/') ||
				pathname.startsWith('/user/') ||
				pathname.startsWith('/@')
			) {
				const keyWords = ['channel', 'c', 'user'];
				validUrl = pathname.split('/').filter((el) => el && !keyWords.includes(el))[0];
				if (validUrl.startsWith('@')) {
					return validUrl.substring(1);
				}
				return validUrl;
			}

			//video
			if (pathname === '/watch' && searchParams.get('v')) {
				return searchParams.get('v') || validUrl;
			}

			return validUrl;
		}

		// twitter
		if (validUrl.includes('twitter.com') || validUrl.includes('x.com')) {	// x.com added
			return pathname.split('/').filter(Boolean)[0] || validUrl; // check account if not author
		}

		// linkedin
		if (validUrl.includes('linkedin.com')) {
			return pathname.split('/').filter(Boolean)[1] || validUrl;
		}
	}

	// domains
	if (validUrl.includes('://')) {
		validUrl = validUrl.split('://')[1];
	}

	return validUrl;
}

export const CACHE_TIME = 30 * 60 * 1000; // 30 minutes
export const REFETCH_TIME = CACHE_TIME - 20 * 60 * 1000;

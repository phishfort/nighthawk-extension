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
		const { pathname, searchParams } = new URL(validUrl);

		// facebook
		if (validUrl.includes('facebook.com')) {
			if (searchParams) {
				validUrl = searchParams.get('id') || searchParams.get('profile_id') || '';
				if (!validUrl) {
					return pathname.split('/').filter(Boolean)[0];
				}
				return validUrl;
			}
			const arr = pathname.split('/').filter(Boolean);
			return arr[arr.length - 1];
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
		if (validUrl.includes('twitter.com')) {
			const arr = pathname.split('/').filter(Boolean);
			return pathname.split('/').filter(Boolean)[0] || arr[arr.length - 1]; // check account if not author
		}

		// linkedin
		if (validUrl.includes('linkedin.com')) {
			const arr = pathname.split('/').filter(Boolean);
			return arr[arr.length - 1];
		}
	}

	// domains
	if (validUrl.includes('://')) {
		validUrl = validUrl.split('://')[1];
	}

	return validUrl;
}

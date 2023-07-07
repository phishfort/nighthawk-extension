import * as React from 'react';
import { useEffect, useState } from 'react';
import YoutubeChannelContentPage from './chanel-page.component';
import YoutubeVideoContentPage from './video-page.component';

const excludedPaths = [
	'shorts',
	'feed',
	'playlist',
	'gaming',
	'premium',
	'tasteprofile',
	'welcome',
	'account',
	'reporthistory'
];

const getPage = (pathname: string) => {
	switch (true) {
		case pathname.includes('/watch'):
			return <YoutubeVideoContentPage />;
		default:
			return <YoutubeChannelContentPage />;
	}
};

let path = '';
const YoutubeContentPage: React.FC = () => {
	const { pathname } = document.location;
	const [currentPath, setCurrentPath] = useState(pathname);

	useEffect(() => {
		path = pathname;
	}, []);

	const handleUpdateTitleEvent = () => {
		const { pathname } = document.location;
		if (pathname !== path) {
			path = pathname;
			setCurrentPath(pathname);
		}
	};

	useEffect(() => {
		document.addEventListener('yt-update-title', handleUpdateTitleEvent);
		return () => {
			document.removeEventListener('yt-update-title', handleUpdateTitleEvent);
		};
	}, []);

	if (currentPath === '/' || excludedPaths.some((el) => currentPath.includes(el))) return null;

	return <>{getPage(currentPath)}</>;
};

export default YoutubeContentPage;

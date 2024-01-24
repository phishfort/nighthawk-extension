import * as React from 'react';
import { useEffect, useState } from 'react';
import TwitterPostContentPage from './twitter-post.component';
import TwitterProfileContentPage from './twitter-profile.component';
import TwitterSearchComponent from './twitter-search.component';
import TwitterPeoplesComponent from './twitter-peoples.component';
import { set } from 'date-fns';

const getPage = (pathname: string) => {
	switch (true) {
		case pathname.includes('/home'):
			return (
				<>
					<TwitterPostContentPage key={pathname} />;
					<TwitterSearchComponent key={`${pathname}-search`} />
				</>
			);
		default:
			return (
				<>
					<TwitterProfileContentPage key={pathname} />;
					<TwitterPostContentPage key={`${pathname}-tweets`} />
					<TwitterSearchComponent key={`${pathname}-search`} />
					<TwitterPeoplesComponent key={`${pathname}-peoples`} />
				</>
			);
	}
};

const excludedPaths = [
	'explore',
	'notifications',
	'messages',
	'bookmarks',
	'lists',
	'topics',
	'flow',
	'circles',
	'newsletters',
	'settings',
	'/i/',
	'keyboard_shortcuts',
	'status'
];

let path = '';
const TwitterContentPage: React.FC = () => {
	const { pathname } = window.location;
	const [currentPath, setCurrentPath] = useState(pathname);
	const [forceRefresh, setForceRefresh] = useState(true);
	const handleUpdate = () => {
		const { pathname } = document.location;
		if (pathname !== path) {
			path = pathname;
			setCurrentPath(pathname);
		}
		setForceRefresh((prev) => !prev);
	};

	useEffect(() => {
		window.addEventListener('DOMSubtreeModified', handleUpdate);
		return () => {
			window.removeEventListener('DOMSubtreeModified ', handleUpdate);
		};
	}, []);

	if (currentPath === '/' || excludedPaths.some((el) => currentPath.includes(el))) return null;

	return <>{getPage(currentPath)}</>;
};

export default TwitterContentPage;

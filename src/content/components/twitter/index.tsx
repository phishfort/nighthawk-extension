import * as React from 'react';
import { useEffect, useState } from 'react';
import TwitterPostContentPage from './twitter-post.component';
import TwitterProfileContentPage from './twitter-profile.component';

const getPage = (pathname: string) => {
	switch (true) {
		case pathname.includes('/home'):
			return <TwitterPostContentPage key={pathname} />;
		default:
			return (
				<>
					<TwitterProfileContentPage key={pathname} />;
					<TwitterPostContentPage key={`${pathname}-tweets`} />
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
	'keyboard_shortcuts'
];

let path = '';
const TwitterContentPage: React.FC = () => {
	const { pathname } = window.location;
	const [currentPath, setCurrentPath] = useState(pathname);
	const handleUpdate = () => {
		const { pathname } = document.location;
		if (pathname !== path) {
			path = pathname;
			setCurrentPath(pathname);
		}
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

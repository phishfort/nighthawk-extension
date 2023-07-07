import * as React from 'react';
import { useEffect, useState } from 'react';
import FacebookProfileContentPage from './facebook-profile.component';
import FacebookGroupContentPage from './facebook-group.component';

const getPage = (pathname: string) => {
	switch (true) {
		case pathname.includes('/groups'):
			return <FacebookGroupContentPage key={pathname} />;
		default:
			return <FacebookProfileContentPage key={pathname} />;
	}
};

const excludedPaths = [
	'friends',
	'marketplace',
	'lists',
	'messenger_media',
	'stories',
	'photo',
	'reel',
	'videos',
	'gaming',
	'live'
];
export const includedPaths = ['friends/suggestions', 'friends/requests'];

let path = '';
const FacebookContentPage: React.FC = () => {
	const { href, pathname } = window.location;
	const [currentPath, setCurrentPath] = useState(href);
	const handleUpdate = () => {
		const { href } = document.location;
		if (href !== path) {
			path = href;
			setCurrentPath(href);
		}
	};

	useEffect(() => {
		window.addEventListener('DOMSubtreeModified', handleUpdate);
		return () => {
			window.removeEventListener('DOMSubtreeModified ', handleUpdate);
		};
	}, []);

	if (
		pathname === '/' ||
		(excludedPaths.some((el) => currentPath.includes(el)) && !includedPaths.some((el) => currentPath.includes(el)))
	)
		return null;

	return <>{getPage(currentPath)}</>;
};

export default FacebookContentPage;

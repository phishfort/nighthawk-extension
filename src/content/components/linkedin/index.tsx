import * as React from 'react';
import { useEffect, useState } from 'react';
import LinkedinProfileContentPage from './linkedin-profile.component';

const getPage = (pathname: string) => {
	switch (true) {
		case pathname.includes('/in') || pathname.includes('/company'):
			return <LinkedinProfileContentPage key={pathname} />;
		default:
			return null;
	}
};

let path = '';
const LinkedinContentPage: React.FC = () => {
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

	if (currentPath === '/') return null;

	return <>{getPage(currentPath)}</>;
};

export default LinkedinContentPage;

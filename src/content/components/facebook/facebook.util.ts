import { queryStringToObject } from '../../utils/index.util';
import { createIconBadge } from '../../utils/icon.util';
import { EWebStatus } from '../../../api/types';

export const getFBAcc = (location: Location) => {
	const { pathname, search } = location;
	if (search) {
		const searchParams = queryStringToObject(search);
		return searchParams.id || searchParams.profile_id;
	}
	const arr = pathname.split('/').filter(Boolean);
	return arr[arr.length - 1];
};

export const getFBGroup = (pathname: string) => {
	const arr = pathname.split('/').filter(Boolean);
	return arr[arr.length - 1];
};

export const createFBProfileIcon = (type: EWebStatus, top = 0, left = 0) => {
	return createIconBadge(type, {
		position: 'absolute',
		width: 22,
		height: 22,
		fontSize: 13,
		top,
		left,
		pt: 1,
		fontWeight: '600'
	});
};

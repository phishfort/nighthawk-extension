import * as React from 'react';
import { useEffect, useState } from 'react';
import { createIconBadge } from '../../utils/icon.util';
import { createDangerousHeader } from '../../utils/dangerous-header.util';
import { ECheckDataType, EWebStatus } from '../../../api/types';
import { useAppSelector } from '../../../event/store';
import { checkScam, selectCheckDataTwitter } from '../../../popup/features/store/scam';
import storeWithMiddleware from '../../../common/mockStore';
import { getTweetAuthorAcc } from './twitter.util';

const TwitterPostContentPage: React.FC = () => {
	const checkData = useAppSelector(selectCheckDataTwitter);
	const [forceRefresh, setForceRefresh] = useState(true);
	const [existedHrefs, setExistedHrefs] = useState<string[]>([]);

	const handleCheckScam = (url: string) => {
		storeWithMiddleware.then(({ dispatch }) =>
			// @ts-ignore
			dispatch(checkScam({ type: ECheckDataType.TWITTER, url }))
		);
	};

	const postElement = document.querySelectorAll('[data-testid=cellInnerDiv]');

	if (postElement.length) {
		postElement.forEach((el) => {
			const post = el as HTMLElement;
			const postContent = el.querySelector('article');

			if (postContent) {
				const anchors = postContent.querySelectorAll('a');

				if (anchors.length) {
					anchors.forEach((anchorEl) => {
						const anchor = anchorEl as HTMLAnchorElement;
						const span = anchor.querySelector('span');
						const acc = span?.textContent;
						if (acc?.startsWith('@')) {
							const { href } = anchor;
							const author = getTweetAuthorAcc(href);

							if (checkData && checkData[author] === EWebStatus.UNKNOWN) return null;

							if (!existedHrefs.find((el) => el === author)) {
								setExistedHrefs((prev) => [...prev, author]);
								handleCheckScam(author);
							}

							if (checkData && checkData[author] === EWebStatus.DANGEROUS) {
								const finishedBorder = post.querySelector('#dangerous-border');

								if (!finishedBorder) {
									postContent.style.marginTop = '40px';
									post.style.boxSizing = 'border-box';
									post.style.border = '2px solid #C30303';

									const header = createDangerousHeader();
									post.prepend(header);
								}
							}

							const finishedIcon = el.querySelector('#badge-icon');
							if (!finishedIcon && checkData && checkData[author]) {
								const icon = createIconBadge(checkData[author], {
									width: 18,
									height: 18,
									fontSize: 11,
									pt: 1
								});
								const div = anchor.querySelector('div');
								if (div) {
									div.style.display = 'flex';
									div.style.alignItems = 'center';
									div.append(icon);
								}
							}
						}
					});
				}
			}
		});
	}

	const handleUpdate = () => {
		setForceRefresh((prev) => !prev);
	};

	useEffect(() => {
		window.addEventListener('DOMSubtreeModified', handleUpdate);
		return () => {
			window.removeEventListener('DOMSubtreeModified', handleUpdate);
		};
	}, []);

	return <></>;
};

export default TwitterPostContentPage;

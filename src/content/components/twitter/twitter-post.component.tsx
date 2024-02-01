import * as React from 'react';
import { useEffect, useState } from 'react';
import { createIconBadge } from '../../utils/icon.util';
import { createDangerousHeader } from '../../utils/dangerous-header.util';
import { ECheckDataType, EWebStatus } from '../../../api/types';
import { useAppSelector } from '../../../event/store';
import { checkScam, selectCheckDataTwitter } from '../../../popup/features/store/scam';
import storeWithMiddleware from '../../../common/mockStore';
import { checkTwitterRedirect, getTweetAuthorAcc } from './twitter.util';

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
	const postContent = document.querySelectorAll('[data-testid=tweetText]');
	const posts = document.querySelectorAll('[data-testid=tweet]');

	if (postContent.length) {
		postContent.forEach((el) => {
			const mentionsDiv = el.querySelectorAll('div.r-xoduu5');
			if (mentionsDiv.length) {
				mentionsDiv.forEach((d) => {
					const anchors = d.querySelectorAll('a');
					if (anchors.length) {
						anchors.forEach((anchorEl) => {
							const anchor = anchorEl as HTMLAnchorElement;
							const result = anchor.textContent as string;
							if (result.startsWith('@')) {
								const acc = anchor.href.split('/').pop() as string;
								if (checkData && checkData[acc] === EWebStatus.UNKNOWN) return null;

								if (!existedHrefs.find((el) => el === acc)) {
									setExistedHrefs((prev) => [...prev, acc]);
									handleCheckScam(acc);
								}

								const finishedIcon = d.querySelector('#badge-icon');
								if (!finishedIcon && checkData && checkData[acc]) {
									const icon = createIconBadge(checkData[acc], {
										width: 16,
										height: 16,
										fontSize: 9
									});
									const div = d as HTMLDivElement;
									div.style.alignItems = 'center';
									div.style.justifyContent = 'start';
									div.style.flexDirection = 'row-reverse';
									div.append(icon);
								}
							}
						});
					}
				});
			}
		});
	}

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

	if (posts.length) {
		posts.forEach((post) => {
			const postContent = post as HTMLElement;
			const links = post.querySelectorAll('a[href^="https://t.co"]');
			if (links.length) {
				links.forEach(async (link) => {
					const anchor = link as HTMLAnchorElement;
					const href = anchor.href;
					if (!href) return null;
					if (!existedHrefs.find((el) => el === href)) {
						setExistedHrefs((prev) => [...prev, href]);
						const isScam = await checkTwitterRedirect(href);
						if (!isScam) return null;
						const finishedBorder = postContent.querySelector('#dangerous-border');

						const image = postContent.querySelector('img');
						console.log(image);
						if (image) {
							image.style.display = 'none';
						}
						if (!finishedBorder) {
							postContent.style.marginTop = '40px';
							postContent.style.boxSizing = 'border-box';
							postContent.style.border = '2px solid #C30303';

							const header = createDangerousHeader('THE REDIRECT LINK IS D/T FROM THE ORIGINAL LINK');
							postContent.prepend(header);
						}
					}
				});
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

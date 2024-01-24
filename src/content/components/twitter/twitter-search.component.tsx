import * as React from 'react';
import { useEffect, useState } from 'react';
import { createIconBadge } from '../../utils/icon.util';
import { ECheckDataType, EWebStatus } from '../../../api/types';
import { useAppSelector } from '../../../event/store';
import { checkScam, selectCheckDataTwitter } from '../../../popup/features/store/scam';
import storeWithMiddleware from '../../../common/mockStore';

const TwitterSearchComponent: React.FC = () => {
	const checkData = useAppSelector(selectCheckDataTwitter);
	const [forceRefresh, setForceRefresh] = useState(true);
	const [existedHrefs, setExistedHrefs] = useState<string[]>([]);

	const handleCheckScam = (url: string) => {
		storeWithMiddleware.then(({ dispatch }) =>
			// @ts-ignore
			dispatch(checkScam({ type: ECheckDataType.TWITTER, url }))
		);
	};
	const recentSearch = document.querySelectorAll('[data-testid=typeaheadRecentSearchesItem]');
	const searchResults = document.querySelectorAll('[data-testid=typeaheadResult]');

	const handleCheckAndRender = (el: Element) => {
		const searchContentSpans = el.querySelectorAll('span');
		if (searchContentSpans?.length) {
			searchContentSpans.forEach((searchEl) => {
				const result = searchEl?.textContent;

				if (result?.startsWith('@')) {
					const acc = result.slice(1);
					if (checkData && checkData[acc] === EWebStatus.UNKNOWN) return null;
					if (!existedHrefs.find((el) => el === acc)) {
						setExistedHrefs((prev) => [...prev, acc]);
						handleCheckScam(acc);
					}

					const finishedIcon = el.querySelector('#badge-icon');
					if (!finishedIcon && checkData && checkData[acc]) {
						const icon = createIconBadge(checkData[acc], {
							width: 18,
							height: 18,
							fontSize: 11,
							pt: 1
						});

						const closeDiv = searchEl.closest('div');
						const parentDiv = searchEl?.parentElement;
						if (closeDiv || parentDiv) {
							if (closeDiv) {
								closeDiv.style.display = 'flex';
								closeDiv.style.alignItems = 'center';
								closeDiv.append(icon);
							} else if (parentDiv) {
								parentDiv.style.display = 'flex';
								parentDiv.style.alignItems = 'center';
								parentDiv.append(icon);
							}
						} else {
							const div = el.querySelectorAll('div.css-175oi2r')[1] as HTMLDivElement;
							if (div) {
								div.style.display = 'flex';
								div.style.alignItems = 'center';
								div.append(icon);
							}
						}
					}
				}
			});
		}
	};
	if (recentSearch.length) {
		recentSearch.forEach((el) => {
			handleCheckAndRender(el);
		});
	}

	if (searchResults.length) {
		searchResults.forEach((el) => {
			const div = el?.querySelectorAll('[data-testid=TypeaheadUser]');
			if (div[0]) {
				handleCheckAndRender(el);
			}
		});
	}
	const handleUpdate = () => {
		setForceRefresh((prev) => !prev);
	};

	useEffect(() => {
		const observer = new MutationObserver(handleUpdate);
		const config = { childList: true, subtree: true };
		const targetNode = document.documentElement;
		if (targetNode) {
			observer.observe(targetNode, config);
		}
		return () => {
			observer.disconnect();
		};
	}, [recentSearch, searchResults]);

	return <></>;
};

export default TwitterSearchComponent;

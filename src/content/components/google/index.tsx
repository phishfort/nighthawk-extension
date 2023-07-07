import * as React from 'react';
import { useState } from 'react';
import { ECheckDataType, EWebStatus } from '../../../api/types';
import storeWithMiddleware from '../../../common/mockStore';
import { checkScam, selectCheckDataGoogle } from '../../../popup/features/store/scam';
import { useAppSelector } from '../../../event/store';
import { getHostFromHref, removeWWW } from '../../utils/index.util';
import { checkPage, setDangerous, setIcon } from './google.util';

const GoogleContentPage: React.FC = () => {
	const location = window.location;
	const checkData = useAppSelector(selectCheckDataGoogle);
	const [existedHrefs, setExistedHrefs] = useState<string[]>([]);

	const showResults = checkPage(location);
	if (!showResults) return null;

	const handleCheckScam = (url: string) => {
		// @ts-ignore
		storeWithMiddleware.then(({ dispatch }) => dispatch(checkScam({ type: ECheckDataType.GOOGLE, url })));
	};

	const searchElement = document.getElementById('rso');
	const adElements = document.querySelectorAll('[data-text-ad]');

	if (searchElement) {
		// @ts-ignore
		[...searchElement.children].concat([...adElements]).forEach((el) => {
			const finished = el.querySelector('#badge-icon') || el.querySelector('#dangerous-border');
			if (finished) return null;

			const block = el as HTMLElement;

			if (el.querySelector('[aria-level="2"]') || el.querySelector('.rllt__details')) return;

			const imageBlock =
				el.querySelector('[data-content-feature]') || el.querySelector('g-img[data-hveid]')?.closest('div');
			const image = imageBlock?.querySelector('img');

			const title: HTMLElement | null =
				el.querySelector('div[aria-level="3"][role=heading]')?.querySelector('span') || el.querySelector('h3');
			const favicon = title?.nextElementSibling?.querySelector('img');
			const urlElement = el.querySelector('span[data-dtld]'); // sponsored section
			const hrefInnerText = urlElement?.innerText;

			const anchor = title?.closest('a');
			const href = anchor?.href;

			if (href) {
				const host = removeWWW(hrefInnerText || getHostFromHref(href));

				if (!existedHrefs.find((el) => el === href)) {
					setExistedHrefs((prev) => [...prev, href]);
					handleCheckScam(host);
				}

				if (checkData && checkData[host] === EWebStatus.UNKNOWN) return null;

				if (title && checkData && checkData[host]) {
					const header = el.querySelector('[data-header-feature]');
					if (imageBlock && image) {
						imageBlock.style.marginLeft = '0px';
						imageBlock.style.left = '8px';
					}
					if (header && image) {
						const { width } = header.getBoundingClientRect();
						header.style.width = `${width + 4}px`;
					}
					if (title.tagName === 'SPAN') {
						title.style.whiteSpace = 'normal';
					}
					if (checkData[host] === EWebStatus.DANGEROUS) {
						setDangerous(block, title, favicon ? 'favicon' : '');
					} else {
						setIcon(title, checkData[host]);
					}
				}
			}
		});
	}

	return <></>;
};

export default GoogleContentPage;

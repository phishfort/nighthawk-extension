import { chromeService } from './chrome.service';
import { mozillaService } from './mozilla.service';

export const { chromeBrowser } = chromeService;
export const { mozillaBrowser } = mozillaService;

export const isMozilla = !!process.env.REACT_APP_MANIFEST_VERSION_V2;

export const currentBrowser = isMozilla ? mozillaBrowser : chromeBrowser;
// @ts-ignore
export const browser = currentBrowser as typeof globalThis.chrome;

export class MozillaService {
	public mozillaBrowser: typeof globalThis.browser;
	constructor(private browser: typeof globalThis.browser) {
		this.mozillaBrowser = {
			...browser,
			action: browser?.browserAction
		};
	}
}

export const mozillaService = new MozillaService(globalThis.browser);

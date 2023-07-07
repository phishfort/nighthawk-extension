export class ChromeService {
	constructor(public chromeBrowser: typeof globalThis.chrome) {}
}

export const chromeService = new ChromeService(globalThis.chrome);

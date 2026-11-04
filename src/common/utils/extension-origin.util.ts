export function getDashboardOrigin(configuredUrl = process.env.REACT_APP_WEB_URL): string | null {
	if (typeof configuredUrl !== 'string' || !configuredUrl) return null;

	try {
		const url = new URL(configuredUrl);
		if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return null;
		return url.origin;
	} catch {
		return null;
	}
}

export function isDashboardUrl(candidateUrl: unknown, configuredUrl = process.env.REACT_APP_WEB_URL): boolean {
	const expectedOrigin = getDashboardOrigin(configuredUrl);
	if (!expectedOrigin || typeof candidateUrl !== 'string') return false;

	try {
		const url = new URL(candidateUrl);
		return url.origin === expectedOrigin && !url.username && !url.password;
	} catch {
		return false;
	}
}

export function isTrustedDashboardMessage(event: MessageEvent, currentWindow: Window = window): boolean {
	const expectedOrigin = getDashboardOrigin();
	// Page scripts can forge origin/source fields on synthetic MessageEvents.
	return (
		!!expectedOrigin &&
		event.isTrusted &&
		event.source === currentWindow &&
		isDashboardUrl(currentWindow.location.href) &&
		event.origin === expectedOrigin
	);
}

export function isExtensionPageUrl(candidateUrl: unknown, expectedPageUrl: string): boolean {
	if (typeof candidateUrl !== 'string') return false;

	try {
		const candidate = new URL(candidateUrl);
		const expected = new URL(expectedPageUrl);
		// Extension schemes can have opaque origins; compare their actual identity and path.
		return (
			(expected.protocol === 'chrome-extension:' || expected.protocol === 'moz-extension:') &&
			candidate.protocol === expected.protocol &&
			candidate.host === expected.host &&
			candidate.pathname === expected.pathname &&
			!candidate.username &&
			!candidate.password
		);
	} catch {
		return false;
	}
}

export function isPlainRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]';
}

export function isValidToken(value: unknown): value is string {
	return typeof value === 'string' && value.length > 0 && !/\s/.test(value);
}

export function isHttpUrlString(value: unknown): value is string {
	if (typeof value !== 'string' || !value || value.trim() !== value) return false;
	try {
		const url = new URL(value);
		return (url.protocol === 'https:' || url.protocol === 'http:') && !!url.hostname && !url.username && !url.password;
	} catch {
		return false;
	}
}

export function getGuardianPoints(value: unknown): number | null {
	if (typeof value === 'string' && !/^\d+(?:\.\d+)?$/.test(value)) return null;
	if (typeof value !== 'number' && typeof value !== 'string') return null;
	const points = Number(value);
	return Number.isFinite(points) && points >= 0 ? points : null;
}

export function isGuardianPoints(value: unknown): value is number | string {
	return getGuardianPoints(value) !== null;
}

export const trustListWelcomeText = `PhishFort maintains a list of trusted sites and accounts, but we don’t review every site and account in existence. If there are sites and accounts you trust, you can add them to your custom Trusted List, and they will appear here.`;

export const formatURL = (url: string) => {
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const isValidUrl = url?.match(urlRegex)?.[0];

	if (!isValidUrl) return 'Not Valid Url';

	const splitUrl = isValidUrl?.split(/(?<=com)\//)[0].split(/https?:\/\//)[1];

	return splitUrl ? splitUrl : 'Incorrect url';
};

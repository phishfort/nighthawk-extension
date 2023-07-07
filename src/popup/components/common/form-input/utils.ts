export const CUSTOM_ERROR_MSG = {
	BLACK_LIST_ERROR_MSG: 'Sorry, the URL you are trying to add is blacklisted by Nighthawk.',
	GREY_LIST_TRUST_LIST_ERROR_MSG:
		'Including this website in your Trust List is discouraged due to the absence of assured secure browsing throughout the entire platform.',
	GREY_LIST_SCAM_REPORT_ERROR_MSG: 'Reporting this URL is not possible.'
};

export interface IOptions {
	isBlackListError?: boolean;
	isTrustListError?: boolean;
	isSpamReportError?: boolean;
}

export const getCustomErrorMsg = ({
	isBlackListError,
	isTrustListError,
	isSpamReportError
}: IOptions) => {
	switch (true) {
		case isBlackListError:
			return CUSTOM_ERROR_MSG.BLACK_LIST_ERROR_MSG;
		case isTrustListError:
			return CUSTOM_ERROR_MSG.GREY_LIST_TRUST_LIST_ERROR_MSG;
		case isSpamReportError:
			return CUSTOM_ERROR_MSG.GREY_LIST_SCAM_REPORT_ERROR_MSG;
		default:
			return '';
	}
};

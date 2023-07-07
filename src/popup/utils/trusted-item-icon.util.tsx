import { EType } from '../../api/types';
import { TwitterGrayIcon } from '../../common/icons/twitter-gray-icon';
import { YoutubeGrayIcon } from '../../common/icons/youtube-gray-icon';
import { FacebookGrayIcon } from '../../common/icons/facebook-gray-icon';
import { LinkedinGrayIcon } from '../../common/icons/linkedin-gray-icon';
import { BrowserGrayIcon } from '../../common/icons/browser-gray-icon';

export const renderTrustedItem = (type?: EType) => {
	switch (type) {
		case EType.FACEBOOK:
			return <FacebookGrayIcon />;
		case EType.YOUTUBE:
			return <YoutubeGrayIcon />;
		case EType.TWITTER:
			return <TwitterGrayIcon />;
		case EType.LINKEDIN:
			return <LinkedinGrayIcon />;
		default:
			return <BrowserGrayIcon />;
	}
};

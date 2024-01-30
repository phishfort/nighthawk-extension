let allowedList = [];
const url = new URL(window.location.href);

// detect if the current page is the warning page
if (window.location.href.includes('warning.html')) {
	const showBox = document.getElementById('show-box');
	const dangerURL = new URL(getDangerURL());
	showBox.innerText = dangerURL.href;
}

// handle danger agree list
const dangerAgreeBTN = document.getElementById('danger-agree');
dangerAgreeBTN.addEventListener('click', handleDangerAgree);
function handleDangerAgree() {
	const dangerURL = getDangerURL();
	if (dangerURL) {
		chrome?.runtime?.sendMessage({
			action: 'setDangerUrl',
			url: dangerURL
		});
	}

	window.location.replace(dangerURL);
}

function getDangerURL() {
	if (url.searchParams.has('url')) {
		return url.searchParams.get('url');
	}
}

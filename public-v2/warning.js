const url = new URL(window.location.href);

// detect if the current page is the warning page
if (window.location.href.includes('warning.html')) {
	const showBox = document.getElementById('show-box');
	const scamDetectionSource = document.getElementById('scam-detection-source')

	// danger url
	const dangerURL = new URL(getDangerURL());
	showBox.innerText = dangerURL.href;

	// scam detection source
	const detectedBy = getDetectionSource();
	if (detectedBy === "rule-engine") scamDetectionSource.innerText = 'Nighthawk Rule Engine'
	else scamDetectionSource.innerText = 'Nighthawk'
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
		// decodeURIComponent to handle the case when the url contains special
		const decodeURL = decodeURIComponent(url.searchParams.get('url'))
		return decodeURL
	}
}


function getDetectionSource() {
	if (url.searchParams.has('detected-by')) {
		return url.searchParams.get('detected-by');
	}
}

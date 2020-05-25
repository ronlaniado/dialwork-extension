$(document).ready(function () {
	$("#autofillButton").click(function () {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { message: "execAutofill" }, function (response) {
				console.log(response.farewell);
			});
		});
	});
});

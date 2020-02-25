$(document).ready(() => {
	console.log("jQuery is working properly");

	$("#collectButton").on("click", () => {
		console.log("Telling the content script to begin gathering all inputs");
		chrome.tabs.executeScript({
			file: "contentScript.js"
		});
	});
});

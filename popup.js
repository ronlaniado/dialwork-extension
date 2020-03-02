$(document).ready(() => {
	chrome.runtime.sendMessage({ message: "keyRequest" }, (response) => {
		//Sends a message to the background script telling it that options.html is active, and that we want the keys.
		let keys = response.farewell;
		getData(keys);
	});
	$("#collectButton").on("click", () => {
		console.log("Telling the content script to begin gathering all inputs");
		chrome.tabs.executeScript({
			file: "contentScript.js"
		});
	});
});

const getData = (keys) => {
	chrome.storage.sync.get(keys, (result) => {
		renderDefaultProfile(result);
	});
};

const renderDefaultProfile = (result) => {
	console.log(result);
	let title = "";
	let rows = "";
	for (const url in result) {
		title = `<h5 class='text-white text-center' id="${url}">` + url + "</h5>";
		rows = "";
		for (const value in result[url]) {
			rows +=
				"<div class='input-group input-group-sm d-flex flex-row my-2' id=" +
				value +
				`><div type='text' class='form-control font-weight-bold input-left key' readonly>` +
				value +
				`</div><div readonly type='text' class='form-control input-right values'"/ aria-describedby='cancel'>` +
				result[url][value] +
				"</div><button class='input-group-append copy-button'>Copy to clipboard</button></div>";
		}
		$(".container").append(
			"<div class='bg-info rounded-sm py-5 px-3 data-container'>" +
				title +
				"<div>" +
				rows +
				"</div>" +
				"</div></div>"
		);
	}
	bindCopy();
};

const bindCopy = () => {
	console.log("binding copy!");
	$(".copy-button").click((e) => {
		console.log("button clicked!");
		console.log($(e.target.previousSibling).text());
	});
};

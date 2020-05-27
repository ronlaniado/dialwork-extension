$(document).ready(function () {
	$("#autofillButton").click(function () {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { message: "execAutofill" }, function (response) {
				console.log(response.farewell);
			});
		});
	});
	$(".clipboard-icon").click(function (e) {
		let input = document.createElement("input");
		input.value = $(e.target.parentNode.previousSibling.previousSibling).text();
		input.style.cssText = "opacity:0; position:fixed";
		document.body.appendChild(input);
		input.focus();
		input.select();
		document.execCommand("copy");
		input.remove();
	});
});

if (typeof input === "undefined") {
	// Assigning to window.input creates the global
	window.keys = new Array();
	window.input = new Object();
}
$(document).ready(() => {
	getInfo();
});

const getInfo = () => {
	$("body input[name]").each(function() {
		if ($(this).val() !== "") {
			// Stores all non-empty inputs into an object
			input[$(this).attr("name")] = $(this).val();
		}
	});
	let currentUrl = window.location.href;
	// current url of page will be used as the key for data object

	// I want to get an object of all the Urls, and then push the new url to the object, and then set the object once again
	chrome.storage.sync.set({ [currentUrl]: input }, () => {
		console.log("Form has been saved to storage");
	});
	keys.push(currentUrl);
	console.log(input);

	// Now I need to have a message be sent to the background page, which will manage all the keys I need
	chrome.runtime.sendMessage({ message: keys }, (response) => {
		console.log(response.farewell);
	});
	updateInfo(keys, input);
};

const updateInfo = (keys, values) => {
	chrome.storage.sync.get("formData", (result) => {
		console.log(result.formData);
		let chromeData = result.formData;
		chromeData[keys] = values;
		chrome.storage.sync.set({ formData: chromeData }, () => {
			console.log("Form saved to storage!");
			chrome.storage.sync.get("formData", (result) => {
				console.log(result.formData);
			});
		});
	});
};

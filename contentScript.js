if (typeof input === "undefined") {
	// Assigning to window.input creates the global
	window.keys = new Array();
	window.input = new Object();
}

getInfo();

function getInfo() {
	$("input[name]").each(function() {
		if ($(this).val() !== "") {
			// Stores all non-empty inputs into an object
			input[$(this).attr("name")] = $(this).val();
		}
	});
	let currentUrl = window.location.href;
	// current url of page will be used as the key for data object

	chrome.storage.sync.set({ [currentUrl]: input }, () => {
		console.log("Form has been saved to storage");
	});
	keys.push(currentUrl);
	console.log(input);

	// Now I need to have a message be sent to the background page, which will manage all the keys I need
	chrome.runtime.sendMessage({ message: keys }, (response) => {
		console.log(response.farewell);
	});
}

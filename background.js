chrome.runtime.onInstalled.addListener(function() {
	console.log("Background script has been installed successfully.");
});

chrome.storage.onChanged.addListener((changes, namespace) => {
	for (let key in changes) {
		let storageChange = changes[key];
		console.log(
			'Storage key "%s" in namespace "%s" changed. ' + 'Old value was "%s", new value is "%s".',
			key,
			namespace,
			storageChange.oldValue,
			storageChange.newValue
		);
		console.log(changes);
	}
});

let keys;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// Gets the keys to the data stored by the extension
	if (request.message === "keyRequest") {
		sendResponse({ farewell: keys });
	} else if (Array.isArray(request.message)) {
		keys = request.message;
		console.log("keys: " + keys);
		sendResponse({ farewell: "The url keys have been received" });
	}
});

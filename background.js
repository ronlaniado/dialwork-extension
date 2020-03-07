chrome.runtime.onInstalled.addListener(function() {
	const defaultProfile = {
		name: "Ron",
		email: "laniado.ron@gmail.com",
		phone: "6464929374",
		location: "Valley Stream",
		zip: "11581"
	};
	console.log("Background script has been installed successfully.");
	chrome.storage.sync.clear();
	chrome.storage.sync.set({ formData: { defaultProfile } }, () => {
		console.log("Form has been saved to storage");
	});
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

chrome.runtime.onInstalled.addListener(function() {
	const defaultProfile = {
		"First Name": {
			value: "Bill",
			autofill: "given-name"
		},

		"Last Name": {
			value: "Gates",
			autofill: "family-name"
		},
		Email: {
			value: "bill.gates@microsoft.com",
			autofill: "email"
		},
		Phone: {
			value: "555-555-5555",
			autofill: "tel"
		},
		Location: {
			value: "Seattle",
			autofill: ""
		},
		Zip: {
			value: "11581",
			autofill: "postal-code"
		},
		LinkedIn: {
			value: "https://www.linkedin.com/in/williamhgates/",
			autofill: "custom-question-linkedin-profile"
		},
		Website: {
			value: "https://www.gatesnotes.com/",
			autofill: "custom-question-website"
		}
	};
	console.log("Background script has been installed successfully.");
	chrome.storage.sync.clear();
	chrome.storage.sync.set({ formData: { defaultProfile } }, () => {
		console.log("Form has been saved to storage");
	});

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		// Gets the keys to the data stored by the extension
		if (request.message === "execAutofill") {
			chrome.tabs.executeScript({
				file: "contentScript.js"
			});
			sendResponse({ farewell: "goodbye!" });
		}
	});
});

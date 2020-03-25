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
		"Full Name": {
			value: "Bill Gates",
			autofill: "custom-name"
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
			value: "Seattle, Washington, United States",
			autofill: "location"
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
		},
		Facebook: {
			value: "https://www.facebook.com/BillGates/",
			autofill: "custom-question-facebook-profile"
		},
		Instagram: {
			value: "https://www.instagram.com/thisisbillgates/",
			autofill: "custom-question-instagram-profile"
		},
		Twitter: {
			value: "@BillGates",
			autofill: "custom-question-twitter-username"
		},
		Youtube: {
			value: "https://www.youtube.com/channel/UCnEiGCE13SUI7ZvojTAVBKw",
			autofill: "custom-question-youtube-channel"
		},
		"Education School Name": {
			value: "Harvard University",
			autofill: "custom-education-school-name"
		},
		"Education Degree": {
			value: "Mathematics",
			autofill: "custom-education-degree"
		},
		"Education Start Month": {
			value: "11",
			autofill: "custom-education-startdate-month"
		},
		"Education Start Year": {
			value: "1976",
			autofill: "custom-education-startdate-year"
		},
		"Education End Month": {
			value: "05",
			autofill: "custom-education-enddate-month"
		},
		"Education End Year": {
			value: "1980",
			autofill: "custom-education-enddate-year"
		},
		"How did you hear about this job?": {
			value: "Through rigious job hunting.",
			autofill: "custom-question-how-did-you-hear-about-this-job"
		},
		"Certification 1": {
			value: "Microsoft Certified: Azure Administrator Associate",
			autofill: "custom-certification-1"
		},
		"Certification 2": {
			value: "Microsoft 365 Certified: Enterprise Administrator Expert",
			autofill: "custom-certification-2"
		},
		"What email program do you use?": {
			value: "Microsoft Outlook",
			autofill: "custom-email-program"
		},
		"What instant messaging do you use?": {
			value: "WhatsApp",
			autofill: "custom-instant-messenger"
		},
		"What browser do you use?": {
			value: "Chrome Version 80",
			autofill: "custom-browser"
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

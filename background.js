chrome.runtime.onInstalled.addListener(function () {
	const defaultProfile = {
		"First Name": {
			value: "Bill",
			autofill: "given-name",
		},
		"Preferred First Name": {
			value: "Billy",
			autofill: "preferred-name",
		},
		"Middle Name": {
			value: "Henry",
			autofill: "additional-name",
		},
		"Last Name": {
			value: "Gates",
			autofill: "family-name",
		},
		"Full Name": {
			value: "Bill Henry Gates",
			autofill: "custom-name",
		},
		Email: {
			value: "bill.gates@microsoft.com",
			autofill: "email",
		},
		Phone: {
			value: "555-555-5555",
			autofill: "tel",
		},
		Location: {
			value: "Seattle, Washington, United States",
			autofill: "location",
		},
		"Street Address": {
			value: "1835 73rd Ave NE and 7400 Northeast 18th Street",
			autofill: "street-address",
		},
		City: {
			value: "Seattle",
			autofill: "locality",
		},
		"Full Address": {
			value: "1835 73rd Ave NE (service entrance) and 7400 Northeast 18th Street (main entrance), Medina, Washington, 98101",
			autofill: "custom-full-address",
		},
		Zip: {
			value: "98101",
			autofill: "postal-code",
		},
		"Cover Letter": {
			value: "Hello. I'd like 1 job, please",
			autofill: "custom-cover-letter",
		},
		LinkedIn: {
			value: "https://www.linkedin.com/in/williamhgates/",
			autofill: "custom-question-linkedin-profile",
		},
		Website: {
			value: "https://www.gatesnotes.com/",
			autofill: "custom-question-website",
		},
		Facebook: {
			value: "https://www.facebook.com/BillGates/",
			autofill: "custom-question-facebook-profile",
		},
		Instagram: {
			value: "https://www.instagram.com/thisisbillgates/",
			autofill: "custom-question-instagram-profile",
		},
		Twitter: {
			value: "@BillGates",
			autofill: "custom-question-twitter-username",
		},
		Youtube: {
			value: "https://www.youtube.com/channel/UCnEiGCE13SUI7ZvojTAVBKw",
			autofill: "custom-question-youtube-channel",
		},
		"Education School Name": {
			value: "Harvard University",
			autofill: "custom-education-school-name",
		},
		"Education Degree": {
			value: "Mathematics",
			autofill: "custom-education-degree",
		},
		"Education Start Month": {
			value: "11",
			autofill: "custom-education-startdate-month",
		},
		"Education Start Year": {
			value: "1976",
			autofill: "custom-education-startdate-year",
		},
		"Education End Month": {
			value: "05",
			autofill: "custom-education-enddate-month",
		},
		"Education End Year": {
			value: "1980",
			autofill: "custom-education-enddate-year",
		},
		"How did you hear about this job?": {
			value: "Through rigious job hunting.",
			autofill: "custom-question-how-did-you-hear-about-this-job",
		},
		"Certification 1": {
			value: "Microsoft Certified: Azure Administrator Associate",
			autofill: "custom-certification-1",
		},
		"Certification 2": {
			value: "Microsoft 365 Certified: Enterprise Administrator Expert",
			autofill: "custom-certification-2",
		},
		"What email program do you use?": {
			value: "Microsoft Outlook",
			autofill: "custom-email-program",
		},
		"What instant messaging do you use?": {
			value: "WhatsApp",
			autofill: "custom-instant-messenger",
		},
		"What browser do you use?": {
			value: "Chrome Version 80",
			autofill: "custom-browser",
		},
		"Desired Salary Range": {
			value: "$50-80 Billion",
			autofill: "custom-salary-range",
		},
	};

	const supportedSites = {
		"boards.greenhouse.io": {
			location: "input[name='job_application[location]']",
			"custom-education-startdate-month": "input[name='job_application[educations][][start_date][month]']",
			"custom-education-startdate-year": "input[name='job_application[educations][][start_date][year]']",
			"custom-education-enddate-month": "input[name='job_application[educations][][end_date][month]']",
			"custom-education-enddate-year": "input[name='job_application[educations][][end_date][year]']",
			"input[name='job_application[educations][][school_name_id]']": "custom-education-school-name",
			"custom-salary-range": "[autocomplete='custom-question-were-all-about-transparency-and-we-want-this-to-be-an-exciting-next-step-this-is-an-ongoing-conversation-but-to-make-sure-were-aligned-what-is-your-desired-base-salary-range']",
		},
		"www.liveworld.com": {
			"given-name": "#first_name",
			"family-name": "#last_name",
			email: "#email_address",
			tel: "#phone",
			"custom-question-facebook-profile": "[name='facebook']",
			"custom-question-instagram-profile": "[name='instagram']",
			"custom-question-instagram-profile": "[name='twitter']",
			"custom-education-degree": "[name='education_diploma_obtained']",
			"custom-certification-1": "[name='certification_1",
			"custom-certification-2": "[name='certification_2",
			"custom-email-program": "#skillset_email_program_used",
			"custom-instant-messenger": "#skillset_IM_used",
			"custom-browser": "#skillset_browser_used",
			"custom-education-school-name": "input[name='education_school_attended']",
		},
		"apply.workable.com": {
			"given-name": "#firstname",
			"family-name": "#lastname",
			email: "#email",
			tel: "[name='phone']",
			"custom-cover-letter": "#cover_letter",
			"custom-name": "#QA_1858145",
		},
		"hire.withgoogle.com": {
			"given-name": "#input_firstName",
			"family-name": "#input_lastName",
			email: "[name='email']",
			tel: "[name='phoneNumber']",
			"custom-full-address": "[name='P_AAAAAAEAAHqGTnrCb47QMz']",
		},
		"recruiting.adp.com": {
			email: "[name='emailAddress']",
			"given-name": "[name='firstName']",
			"preferred-name": "[name='$$preferredName']",
			"additional-name": "[name='middleName']",
			"family-name": "[name='lastName']",
			tel: "[name='phone']",
			"street-address": "[name='address1']",
			locality: "[name='city']",
			"postal-code": "[name='zip']",
		},
	};
	console.log(supportedSites);
	console.log("Background script has been installed successfully.");
	chrome.storage.sync.clear();
	chrome.storage.sync.set({ formData: { defaultProfile }, supportedSites }, () => {
		console.log("Form has been saved to storage");
	});

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		// Gets the keys to the data stored by the extension
		if (request.message === "execAutofill") {
			chrome.tabs.executeScript({
				file: "contentScript.js",
			});
			sendResponse({ farewell: "goodbye!" });
		}
	});
});

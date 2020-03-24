if (typeof input === "undefined") {
	// Assigning to window.input creates the global
	window.keys = new Array();
	window.input = new Object();
}
$(document).ready(() => {
	addAutofills();
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.message === "execCollectInfo") {
			console.log("collecting info!");
			getInfo();
		} else if (request.message === "execAutofill") {
			console.log("Autofilling the forms on this page!");
			autofill();
		}
	});
});

$("iframe").ready(function() {
	// do something once the iframe is loaded
	console.log("iframe finished loading!");
	console.log($("#grnhse_iframe").attr("src"));
	console.log(document.getElementById("grnhse_iframe").contentWindow);
	$("iframe").each(function() {
		console.log($(this).contents());
	});
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

const autofill = () => {
	chrome.storage.sync.get("formData", (result) => {
		let data = result.formData.defaultProfile;
		console.log(data);
		$("input").each(function() {
			console.log($(this).val());
			// Get all keys from data
			// Interate through the indices of the keys
			// For each index, find the autocomplete key and set its value to $(this).val(autocompleteValue)
			let dataKeys = Object.keys(data);

			for (let i = 0; i < dataKeys.length; i++) {
				let inputName = $(this).attr("name");
				if ($(this).attr("autocomplete") === data[dataKeys[i]]["autofill"]) {
					console.log("I can autofill here!");
					// Matches autofilling values from data
					$(this).val(data[dataKeys[i]]["value"]);
				} else if (typeof inputName !== "undefined" && inputName.includes(dataKeys[i].toLowerCase())) {
					console.log(inputName);
					console.log(dataKeys[i].toLowerCase());
					console.log(inputName.includes(dataKeys[i].toLowerCase()));
					$(this).val(data[dataKeys[i]]["value"]);
				} else if ($(this).attr("")) {
				} else {
					console.log("couldn't autofill");
				}
			}
		});
	});
};

const addAutofills = () => {
	// Will look for specific domain names, and add autofill tags proactively
	switch (window.location.hostname) {
		case "boards.greenhouse.io":
			console.log("url has matched!");
			$("input[name='job_application[location]']").attr("autocomplete", "location");
			$("input[name='job_application[educations][][start_date][month]']").attr("autocomplete", "custom-education-startdate-month");
			$("input[name='job_application[educations][][start_date][year]']").attr("autocomplete", "custom-education-startdate-year");
			$("input[name='job_application[educations][][end_date][month]']").attr("autocomplete", "custom-education-enddate-month");
			$("input[name='job_application[educations][][end_date][year]'").attr("autocomplete", "custom-education-enddate-year");
	}
};

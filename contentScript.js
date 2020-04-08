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
	$("body").append("<div id='dialog-boxes' style='display:flex;flex-direction:column;bottom:0;right:0;position:fixed'></div>");
});

const getInfo = () => {
	$("body input[name]").each(function () {
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
		$("input, textarea").each(function () {
			console.log($(this).val());
			// Get all keys from data
			// Interate through the indices of the keys
			// For each index, find the autocomplete key and set its value to $(this).val(autocompleteValue)
			let dataKeys = Object.keys(data);

			for (let i = 0; i < dataKeys.length; i++) {
				let inputName = $(this).attr("name");
				if ($(this).attr("autocomplete") === data[dataKeys[i]]["autofill"]) {
					console.log("I can autofill here!" + "I am " + inputName);
					// Matches autofilling values from data
					$(this).val(data[dataKeys[i]]["value"]);
				} else if (typeof inputName !== "undefined" && inputName.includes(dataKeys[i].toLowerCase())) {
					console.log(inputName);
					console.log(dataKeys[i].toLowerCase());
					console.log(inputName.includes(dataKeys[i].toLowerCase()));
					// Temporarily commented out line underneath, until it is made into a suggestion
					// $(this).val(data[dataKeys[i]]["value"]);
				} else if ($(this).attr("")) {
				} else {
					console.log("couldn't autofill");
				}
			}
		});
	});
	suggestAddAutofill();
};

// Listen if the user clicks on an input that is EMPTY
// Once the user clicks out of it, check if the input now has a value
// if there's a value, show dialog suggesting the user to add it as an autofill

const suggestAddAutofill = () => {
	$("input, textarea").on("click", function () {
		if ($(this).val() === "") {
			console.log($(this));
			console.log("detected an empty input");
			$(this).one("blur", function () {
				if ($(this).val() != "") {
					console.log("detected a change in empty input!");
					displayAddAutofill($(this).val(), $(this).attr("name"));
					$(this).off("click", "blur");
				}
			});
		}
	});
};

const displayAddAutofill = (value, inputName) => {
	const dialogBox = `
		<div style="position:relative;background:white;width:300px;padding:8px;margin-bottom:15px;margin-right:15px;border-radius:5px;border:2px solid #e6e6e6;
				">
			<p>I have detected that you manually typed an input I have not recognized, would you like to add this to your collection of autofills?</p>
			<div style="display:flex;flex-direction:column;justify-content:center">
				<input class="dialogTitle" placeholder="Title" style="border-color:#cccccc; border-style:solid; font-size:12px; border-radius:3px; padding:3px; border-width:1px;">
				<input value=${value} style="border-color:#cccccc; border-style:solid; font-size:12px; border-radius:3px; padding:3px; border-width:1px;">
			<div>
			<div style="display: flex;flex-direction: row;justify-content: space-evenly;margin-top:5px">
				<button class="dismiss-button" style="">Dismiss</button>
				<button class="add-button">Add</button>
			</div>
		</div>
	`;
	$("#dialog-boxes").append(dialogBox);
	$(".dismiss-button").click(function () {
		$(this).parent().parent().parent().parent().remove();
	});
	$(".add-button").click(function () {
		let dialogTitle = $(".dialogTitle").val();
		$(this).parent().parent().parent().parent().remove();
		console.log(inputName);
		chrome.storage.sync.get("formData", function (result) {
			// This function needs support to also update the supportedSites json object as well
			console.log(value);
			let defaultProfile = result.formData.defaultProfile;
			defaultProfile[dialogTitle] = {};
			defaultProfile[dialogTitle]["value"] = value;
			// This id should be changed in the future, but it ok for the proof-of-concept
			defaultProfile[dialogTitle]["autofill"] = inputName;
			console.log(defaultProfile);
			chrome.storage.sync.clear();
			chrome.storage.sync.set({ formData: { defaultProfile } }, () => {
				console.log("Form has been successfully saved!");
			});
		});
		// map this to the addAutofills
		// add this as an autofill in the default profile
	});
	console.log("displayed dialog");
};

const addAutofills = () => {
	// autumatically looks for specific websites and adds autofills for them to make the extension work really well
	// Will look for specific domain names, and add autofill tags proactively
	chrome.storage.sync.get("supportedSites", function (result) {
		let currentTab = window.location.hostname;
		let data = result.supportedSites;
		let supportedSitesArr = Object.keys(data);
		let supportedSiteIndex = supportedSitesArr.indexOf(currentTab);
		if (supportedSiteIndex >= 0) {
			let siteData = data[currentTab];
			let siteKeys = Object.keys(siteData);
			for (let i = 0; i < siteKeys.length; i++) {
				$(siteData[siteKeys[i]]).attr("autocomplete", siteKeys[i]);
			}
			console.log("I have detected that this website is supported by the Stronghire extension, and have created the necessary autofills to run!");
		}
	});
};

/*
	Greenhouse: 
	$("a[data-source='paste'][aria-labelledby='resume']")[0].dispatchEvent(new MouseEvent("click"));
	$(".school-name")[0].dispatchEvent(new MouseEvent("click"));
	*/

/*
	Liveworld: 
	$("input[name='education_school_attended']").attr("autocomplete", "custom-education-school-name");
	$("#certify")[0].dispatchEvent(new MouseEvent("click"));4
	*/

$(document).ready(() => {
	//addInlineAutofills();
	addAutofills();
	saveSite();
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.message === "execCollectInfo") {
			collectInfo();
		} else if (request.message === "execAutofill") {
			autofill();
		}
	});
	$("body").append("<div id='dialog-boxes' style='display:flex;flex-direction:column;bottom:0;right:0;position:fixed'></div>");
});

if (typeof input === "undefined") {
	// Assigning to window.input creates the global
	window.keys = new Array();
	window.input = new Object();
}

function collectInfo() {
	$("body input[name]").each(function () {
		if ($(this).val() !== "") {
			// Stores all non-empty inputs into an object
			input[$(this).attr("name")] = $(this).val();
		}
	});
	let currentUrl = window.location.href;
	chrome.storage.sync.set({ [currentUrl]: input });
	keys.push(currentUrl);
	// Now I need to have a message be sent to the background page, which will manage all the keys I need
	chrome.runtime.sendMessage({ message: keys });
	updateInfo(keys, input);
}

function updateInfo(keys, values) {
	chrome.storage.sync.get("formData", (result) => {
		let chromeData = result.formData;
		chromeData[keys] = values;
		chrome.storage.sync.set({ formData: chromeData }, () => {
			chrome.storage.sync.get("formData", (result) => {});
		});
	});
}

function autofill() {
	chrome.storage.sync.get("formData", (result) => {
		let data = result.formData.defaultProfile;
		$("input, textarea").each(function () {
			// Get all keys from data
			// Interate through the indices of the keys
			// For each index, find the autocomplete key and set its value to $(this).val(autocompleteValue)
			let dataKeys = Object.keys(data);

			for (let i = 0; i < dataKeys.length; i++) {
				let inputName = $(this).attr("name");
				if ($(this).attr("autocomplete") === data[dataKeys[i]]["autofill"]) {
					// Matches autofilling values from data
					$(this).val(data[dataKeys[i]]["value"]);
				} else if (typeof inputName !== "undefined" && inputName.includes(dataKeys[i].toLowerCase())) {
					// Temporarily commented out line underneath, until it is made into a suggestion
					// $(this).val(data[dataKeys[i]]["value"]);
				} else if ($(this).attr("")) {
				} else {
				}
			}
		});
	});
	suggestAddAutofill();
}

function suggestAddAutofill() {
	$("input, textarea").on("click", function () {
		if ($(this).val() === "") {
			$(this).one("blur", function () {
				if ($(this).val() != "") {
					let inputTitle;
					if ($(this).attr("label")) {
						console.log($(this).attr("label"));
						inputTitle = $(this).attr("label");
					} else if ($(this).attr("name")) {
						inputTitle = $(this).attr("name");
					} else if ($(this).attr("id")) {
						inputTitle = $(this).attr("id");
					} else {
						inputTitle = "Title";
					}
					displayAddAutofill($(this).val(), $(this).attr("name"), inputTitle);
					$(this).off("click", "blur");
				}
			});
		}
	});
}

function displayAddAutofill(inputValue, inputName, inputTitle) {
	let imgURL = chrome.runtime.getURL("assets/just_logo48.png");
	// Displayed when the users inputs something into a field that is not recognized by the extension
	const dialogBox = `
		<div style="position:relative;background:white;width:250px;padding:8px;margin-bottom:15px;margin-right:15px;border-radius:5px;border:2px solid #e6e6e6;
				">
			<div style="display:flex;flex-direction:row;justify-content:flex-start;align-items:center;">
				<img src="${imgURL}" alt="Stronghire logo" style="height:40px;width:37px;"/>
				<p style="margin-left:15px;font-size:18px;">Stronghire Assistant</p>
			</div>
			<p style="font-weight:600; margin-top:3px;">Add detected input?</p>
			<div style="display:flex;flex-direction:column;justify-content:center">
				<input class="dialogTitle" placeholder="Suggested title: ${inputTitle}" style="border-color:#cccccc; border-style:solid; font-size:12px; border-radius:3px; padding:3px; margin-top:5px; border-width:1px;">
				<input class="dialogValue" placeholder="Value" value="${inputValue}" style="border-color:#cccccc; border-style:solid; font-size:12px; border-radius:3px; padding:3px; margin-top:10px; border-width:1px;">
			<div>
			<div style="display: flex;flex-direction: row;justify-content: space-evenly;margin-top:15px">
				<button class="dismiss-button" style="">Dismiss</button>
				<button class="add-button" style="">Add</button>
			</div>
		</div>
	`;
	$("#dialog-boxes").append(dialogBox);
	$(".dismiss-button").click(function () {
		$(this).parent().parent().parent().parent().remove();
	});
	$(".add-button").click(function () {
		let dialogTitle = $(".dialogTitle").val();
		console.log(dialogTitle);
		$(this).parent().parent().parent().parent().remove();
		chrome.storage.sync.get(["formData", "supportedSites"], function (result) {
			// This function needs support to also update the supportedSites json object as well
			let defaultProfile = result.formData.defaultProfile;
			let supportedSites = result.supportedSites;
			supportedSites[window.location.hostname][inputName] = `[name='${inputName}']`;
			defaultProfile[dialogTitle] = {};
			defaultProfile[dialogTitle]["value"] = inputValue;
			// This id should be changed in the future, but it ok for the proof-of-concept
			defaultProfile[dialogTitle]["autofill"] = inputName;
			chrome.storage.sync.set({ formData: { defaultProfile }, supportedSites });
		});
		// map this to the addAutofills
		// add this as an autofill in the default profile
	});
}

function addAutofills() {
	// Autumatically looks for specific websites and adds autofills for them to make the extension predict consistently
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
		}
	});
}

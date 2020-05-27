$(document).ready(() => {
	//addInlineAutofills();
	injectTray();
	verifyAutofillSupport(window.location.hostname);
	saveSite(window.location.href);
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.message === "execCollectInfo") {
			collectInfo();
		} else if (request.message === "execAutofill") {
			autofill();
			sendResponse({ farewell: "Successfully autofilled from default profile" });
		}
	});
	$("body").append("<div id='dialog-boxes' style='display:flex;flex-direction:column;bottom:0;right:0;position:fixed'></div>");
});

function verifyAutofillSupport(url) {
	chrome.storage.sync.get("unsupportedSites", function (result) {
		let sites = result.unsupportedSites;
		console.log(sites);
		console.log(url);
		if (sites.includes(url)) {
			alert("This website does not support Stronghire Autofilling at this current time.");
		} else {
			addAutofills();
		}
	});
}

function collectInfo() {
	let input = {};
	let keys = {};
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
	$("#dialog-boxes").draggable();
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

function saveSite(url) {
	// Saves the current website to be shared with server in order to recommend jobs to others
	chrome.storage.sync.get("applicationsVisited", function (result) {
		let sites = result.applicationsVisited;
		if (!sites.includes(url)) {
			sites.push(url);
			console.log(sites);
			chrome.storage.sync.set({ applicationsVisited: sites });
		}
	});
}

function injectTray() {
	if (!$("#stronghire-tray").length) {
		// Checks if tray is already injected
		let trayHTML = chrome.runtime.getURL("index.html");
		let timesIcon = chrome.runtime.getURL("../assets/icons/times-circle.svg");
		let stronghireLogo = chrome.runtime.getURL("../assets/logo_with_text.png");
		let externalLinkIcon = chrome.runtime.getURL("../assets/icons/external-link.svg");
		let iframe = `<div id="stronghire-tray" style="z-index:1000;position:fixed;	box-shadow: 3px 3px 50px rgba(0, 0, 0, 0.18);border: 1px solid #c3c3c3;opacity: 1; border-radius:7px;">
					<div style="display: flex;position:relative;flex-direction:row;justify-content:center;align-items:center;width:100%;height:65px;background-color:white;border-bottom: 1px solid #C3C3C3;border-top-left-radius:7px; border-top-right-radius:7px;cursor: grab;" id="top-bar">
						<div style="order:-1;position:absolute;top:0;left:0;display:flex;flex-direction:column;justify-content:space-evenly;height:100%;">
							<img src="${timesIcon}" id="timesIcon" height="20px" width="20px" style="cursor:pointer;padding-left: 10px; padding-right:10px;"/>
							<img src="${externalLinkIcon}" id="externalLinkIcon" height="18px" width="18px" style="cursor:pointer;padding-left:10px;padding-right:10px"/>
						</div>
						<img src="${stronghireLogo}" id="stronghireLogo" height="50px" width="185px"/>
					</div>
					<iframe title="Stronghire Assistant Tray" src="${trayHTML}" width="400px" height="600px" frameborder="0" style="border-bottom-left-radius:7px; border-bottom-right-radius:7px;" style=""></iframe>
				<div>`;

		$("body").prepend(iframe);
		$("#stronghire-tray").draggable({
			containtment: "window",
			scroll: false,
		});
		$("#timesIcon").click(function () {
			// Close tray on button click
			$(this).parent().parent().parent().remove();
		});
		$("#externalLinkIcon").click(function () {
			window.open().document.write(iframe);
		});
		console.log("loaded iframe...?");
	}
}

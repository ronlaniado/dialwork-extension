$(document).ready(() => {
	chrome.tabs.executeScript({
		file: "contentScript.js"
	});
	renderDefaultProfile();
	bindCopy();
	bindCollectInfo();
	bindAutofill();
	bindOpenSettings();
});

const renderDefaultProfile = () => {
	chrome.storage.sync.get("formData", (result) => {
		let formData = result.formData;
		console.log(formData);
		rows = "";
		for (const defaultTitle in formData) {
			if (defaultTitle === "defaultProfile") {
				for (const value in formData.defaultProfile) {
					rows += `<tr>
							<th scope='row'>
							<button class="copyButton">
								<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clipboard" class="svg-inline--fa fa-clipboard fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
									<path class="copy" d="M384 112v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h80c0-35.29 28.71-64 64-64s64 28.71 64 64h80c26.51 0 48 21.49 48 48zM192 40c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24m96 114v-20a6 6 0 0 0-6-6H102a6 6 0 0 0-6 6v20a6 6 0 0 0 6 6h180a6 6 0 0 0 6-6z">
									</path>
								</svg>
								</button>
							</th>
							<td>${value}</td>
							<td>${formData.defaultProfile[value]["value"]}</td>
						</tr>`;
				}
			}
			$(".container").append(
				`<div class='rounded-sm py-2 px-3 data-container'>
				<h5 class='text-info text-center' id='${defaultTitle}'>My default profile</h5>
					<table class='table table-striped'>
						<thead>
							<tr>
								<th scope='col'>Copy</th>
								<th scope='col'>Key</th>
								<th scope='col'>Value</th>
							</tr>
						</thead>
						<tbody>
							${rows}
						</tbody></table>
					</div></div>`
			);
		}
	});
};

const bindCollectInfo = () => {
	$("#collectButton").on("click", () => {
		console.log("CLICKED");
		// Send a message to the content script to begin collecting info
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { message: "execCollectInfo" }, function(response) {
				console.log(response.farewell);
			});
		});
	});
};

const bindCopy = () => {
	console.log("binding copy!");
	console.log($(".copyButton"));
	$(".copyButton").on("click", (e) => {
		console.log("button clicked!");
		let copyText = $(e.target.parentNode.parentNode.nextSibling.nextSibling.nextElementSibling).text();
		console.log(copyText);
		let input = document.createElement("input");
		input.value = copyText;
		input.style.cssText = "opacity:0; position:fixed";
		document.body.appendChild(input);
		input.focus();
		input.select();
		document.execCommand("copy");
		input.remove();
	});
};

const bindAutofill = () => {
	$("#autofillButton").click(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { message: "execAutofill" }, function(response) {
				console.log(response.farewell);
			});
		});
	});
};

const bindOpenSettings = () => {
	$("#settingsButton").click(() => {
		chrome.runtime.openOptionsPage();
	});
};

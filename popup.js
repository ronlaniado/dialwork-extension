$(document).ready(() => {
	chrome.runtime.sendMessage({ message: "keyRequest" }, (response) => {
		//Sends a message to the background script telling it that options.html is active, and that we want the keys.
		let keys = response.farewell;
		renderDefaultProfile();
	});
	$("#collectButton").on("click", () => {
		console.log("Telling the content script to begin gathering all inputs");
		chrome.tabs.executeScript({
			file: "contentScript.js"
		});
	});
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
							<th scope='row'><i class="fas fa-clipboard"></i></th>
							<td>${value}</td>
							<td>${formData.defaultProfile[value]}</td>
						</tr>`;
				}
			}
			$(".container").append(
				`<div class='rounded-sm py-5 px-3 data-container'>
				<h5 class='text-primary text-center' id='${defaultTitle}'>${defaultTitle}</h5>
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
		bindCopy();
	});
};

const bindCopy = () => {
	console.log("binding copy!");
	$(".copy-button").click((e) => {
		console.log("button clicked!");
		console.log($(e.target.previousSibling).text());
	});
};

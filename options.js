$(document).ready(() => {
	// chrome.runtime.sendMessage({ message: "keyRequest" }, (response) => {
	// 	//Sends a message to the background script telling it that options.html is active, and that we want the keys.
	// 	let keys = response.farewell;
	// 	getData(keys);
	// });
	// I may not need to above function, I can simply pull the formData variable from chromeStorage!
	getData();
});

const getData = () => {
	chrome.storage.sync.get("formData", (result) => {
		console.log(result.formData);
		renderData(result.formData);
	});
};

const renderData = (result) => {
	// Renders a collapsible list for each link that has key:value pairs inside of it
	console.log(result);
	let title = "";
	let rows = "";
	for (const url in result) {
		title = `<h5 class='text-white text-center' id="${url}">` + url + "</h5>";
		rows = "";
		for (const value in result[url]) {
			rows +=
				"<div class='input-group input-group-sm d-flex flex-row my-2' id=" +
				value +
				`><input type='text' class='form-control font-weight-bold input-left key' value="${value}">` +
				`</input><input type='text' class='form-control input-right value' value="${result[url][value]}"/ aria-describedby='cancel'>` +
				"</input><div class='input-group-append cancel-button'><span class='input-group-text' id='cancel'>X</span></div></div>";
		}
		const saveButton =
			"<button class='btn btn-warning center save-button' type='button' style='display:none'>Save changes</button>";
		$(".container").append(
			`<div class='bg-info rounded-sm py-5 px-3 m-2 data-container' id="${url}">` +
				title +
				"<div>" +
				rows +
				"</div>" +
				saveButton +
				"</div></div>"
		);
	}

	// bind on blur adds the detection to check for empty inputs in order to remove them

	bindCancel();
	bindButtonClick();
};

const bindCancel = () => {
	$(".cancel-button").click((e) => {
		console.log("cancel button clicked!");
		const parentId = e.target.parentNode.parentNode.id;
		console.log(parentId);
		$(`#${$.escapeSelector(parentId)}`).remove();
		$(".save-button").css("display", "block");
	});
};

const bindButtonClick = () => {
	$(".save-button").click((e) => {
		let dataString = "";
		let data = {};
		let url = "";
		console.log("button clicked!");
		let parentId = e.target.parentNode.id;
		console.log(parentId);
		$("#" + $.escapeSelector(parentId)).each(() => {
			dataString;
			url = parentId;
			console.log(url);
			data = {};
			$(".input-group").each((i, val) => {
				console.log(i);
				let key = $(val)
					.find("input:nth-child(1)")
					.val();
				let value = $(val)
					.find("input:nth-child(2)")
					.val();
				data[key] = value;
			});
		});
		console.log(data);
		// update new object in using chrome's storage api
		chrome.storage.sync.get("formData", (result) => {
			let chromeData = result.formData;
			chromeData[url] = data;
			console.log(chromeData);

			chrome.storage.sync.set({ formData: chromeData }, () => {
				console.log("Form saved to storage!");
				chrome.storage.sync.get("formData", (result) => {
					let localData = result.formData;
					console.log("New data from chrome is: " + localData);
				});
			});
		});
	});
};

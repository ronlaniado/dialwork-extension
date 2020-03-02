$(document).ready(() => {
	chrome.runtime.sendMessage({ message: "keyRequest" }, (response) => {
		//Sends a message to the background script telling it that options.html is active, and that we want the keys.
		let keys = response.farewell;
		getData(keys);
	});
});

const getData = (keys) => {
	chrome.storage.sync.get(keys, (result) => {
		console.log(result);
		renderData(result);
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
			"<div class='bg-info rounded-sm py-5 px-3 data-container'>" +
				title +
				"<div>" +
				rows +
				"</div>" +
				saveButton +
				"</div></div>"
		);
	}

	bindOnBlur();
	// bind on blur adds the detection to check for empty inputs in order to remove them

	bindCancel();
	bindButtonClick();
};

const bindOnBlur = () => {
	$("#input-group :input").blur((e) => {
		if (e.target.value.length === 0) {
			const parentId = e.target.parentNode.id;
			$(`#${$.escapeSelector(parentId)}`).remove();
			$(".save-button").css("display", "block");
		} else {
			chrome.runtime.sync.set({});
		}
	});
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
		console.log("button clicked!");
		$(".data-container").each(() => {
			dataString;
			let url = $("h5").text();
			data[url] = {};
			$(".input-group").each((i, val) => {
				let key = $(val)
					.find("input:nth-child(1)")
					.val();
				let value = $(val)
					.find("input:nth-child(2)")
					.val();
				data[url][key] = value;
			});
			console.log(data);
		});

		// search through and find all inputs, then push them into a javascript array. Every other input should be paired as a key:value
		// set the title to the const url
		// make title the outmost key, with the values being a nested object
		// nested object will have the key value pairs as mentioned above
	});
};

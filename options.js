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
		title = "<h5 class='text-white text-center url'>" + url + "</h5>";
		rows = "";
		for (const value in result[url]) {
			rows +=
				"<div class='input-group input-group-sm d-flex flex-row my-2' id=" +
				value +
				`><input type='text' class='form-control font-weight-bold input-left' value="${value}" id='hi'>` +
				`</input><input type='text' class='form-control input-right' value="${result[url][value]}"/ aria-describedby='cancel'>` +
				"</input><div class='input-group-append cancel-button'><span class='input-group-text' id='cancel'>X</span></div></div>";
		}
		const saveButton =
			"<button class='btn btn-warning center save-button' type='button' style='display:none'>Save changes</button>";
		$(".container").append(
			"<div class='bg-info rounded-sm py-5 px-3'>" +
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
			let newValue = e.target.value;
			chrome.runtime.sync.set({});
		}
	});
};

const bindCancel = () => {
	$(".cancel-button").click((e) => {
		console.log("cancel button clicked!");
		const parentId = e.target.parentNode.parentNode.id;
		$(`#${$.escapeSelector(parentId)}`).remove();
		$(".save-button").css("display", "block");
	});
};

const bindButtonClick = () => {
	$(".save-button").click((e) => {
		console.log("detected button click");
		const parentDiv = $.escapeSelector(e.target.parentNode.parentNode.id);
		let url = $(parentDiv).find("#url");
		console.log(url);
	});
};

$(document).ready(() => {
	getData();
});

const getData = () => {
	chrome.storage.sync.get("formData", (result) => {
		console.log(result.formData);
		renderData(result.formData);
	});
};

const renderData = (result) => {
	console.log(result);
	let title = "";
	let rows = "";
	for (const url in result) {
		title = `<h5 class='text-white text-center' id="${result[url]}">My profile</h5>`;
		rows = "";
		for (const value in result[url]) {
			console.log(result[url]);
			console.log(value);
			rows += `<div class='input-group input-group-sm d-flex flex-row my-2' id="${value}">
					<input type='text' class='form-control font-weight-bold input-left key' value="${value}" />
					<input type='text' class='form-control input-right value' value="${result[url][value]["value"]}"/ aria-describedby='cancel' />
					<div class='input-group-append cancel-button'>
						<span class='input-group-text' id='cancel'>X</span>
					</div>
				</div>`;
		}
		const saveButton = "<button class='btn btn-warning center save-button' type='button' style='display:none'>Save changes</button>";
		$(".container").append(`<div class='bg-info rounded-sm py-5 px-3 m-2 data-container' id="${url}">` + title + "<div>" + rows + "</div>" + saveButton + "</div></div>");
	}
	bindCancel();
	bindSaveButton();
	bindInputChange();
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

const bindSaveButton = () => {
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
				let key = $(val).find("input:nth-child(1)").val();
				let value = $(val).find("input:nth-child(2)").val();
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

const bindInputChange = () => {
	$(".form-control").on("change", () => {
		$(".save-button").css("display", "block");
	});
};

const selectorOptions = `
<option></option>
`;

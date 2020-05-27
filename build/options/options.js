$(document).ready(() => {
	getData();
});

const getData = () => {
	chrome.storage.sync.get("formData", (result) => {
		renderData(result.formData);
	});
};

const renderData = (result) => {
	console.log(result);
	let title, rows;
	for (const url in result) {
		title = `<h5 class='text-white text-center' id="${result[url]}">My profile</h5>`;
		rows = "";
		for (const value in result[url]) {
			console.log(result[url][value]["autofill"]);
			rows += `<div class='input-group input-group-sm d-flex flex-row my-2' id="${value}">
					<input type='text' class='form-control font-weight-bold input-left key' value="${value}" disabled="true" autofill="${result[url][value]["autofill"]}"/>
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
		let dataString;
		let data = {};
		let url = e.target.parentNode.id;

		$("#" + $.escapeSelector(url)).each(() => {
			dataString;
			data = {};
			$(".input-group").each((i, val) => {
				let key = $(val).find("input:nth-child(1)").val();
				let value = $(val).find("input:nth-child(2)").val();
				let autofill = $(val).find("input:nth-child(1)").attr("autofill");
				console.log(autofill);
				data[key] = {};
				data[key]["value"] = value;
				data[key]["autofill"] = autofill;
			});
		});
		chrome.storage.sync.set({ formData: { defaultProfile: data } });
	});
};

const bindInputChange = () => {
	$(".form-control").on("change", () => {
		$(".save-button").css("display", "block");
	});
};

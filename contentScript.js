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
});

const getInfo = () => {
	$("body input[name]").each(function() {
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
		$("input, textarea").each(function() {
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
	$("input, textarea").click(function() {
		if ($(this).val() === "") {
			console.log("detected an empty input");
			$(this).blur(function() {
				if ($(this).val() != "") {
					console.log("detected a change in empty input!");
					displayAddAutofill();
				}
			});
		}
	});
};

const displayAddAutofill = () => {
	const dialogbox = `
		<div style="position: fixed;
    				bottom: 0;
					right: 0;
					background: white;
					width: 300px;
					padding: 8px;
					margin-bottom: 15px;
					margin-right: 15px;
					border-radius: 5px;
					border: 2px solid #e6e6e6;
				">
			<p>I have detected that you manually typed an input I have not recognized, would you like to add this to your collection of autofills?</p>
			<div style="
				display: flex;
				flex-direction: row;
				justify-content: space-evenly;
				
			">
			<button id="dismiss-button">Dismiss</button>
			<button>Add</button>
			</div>
		</div>
	`;
	$("body").append(dialogbox);
	$("#dismiss-button").click(function() {
		$(this)
			.parent()
			.parent()
			.remove();
	});
	console.log("displayed dialog");
};

const addAutofills = () => {
	// autumatically looks for specific websites and adds autofills for them to make the extension work really well
	console.log(window.location.hostname);
	// Will look for specific domain names, and add autofill tags proactively
	switch (window.location.hostname) {
		case "boards.greenhouse.io":
			$("input[name='job_application[location]']").attr("autocomplete", "location");
			$("input[name='job_application[educations][][start_date][month]']").attr("autocomplete", "custom-education-startdate-month");
			$("input[name='job_application[educations][][start_date][year]']").attr("autocomplete", "custom-education-startdate-year");
			$("input[name='job_application[educations][][end_date][month]']").attr("autocomplete", "custom-education-enddate-month");
			$("input[name='job_application[educations][][end_date][year]'").attr("autocomplete", "custom-education-enddate-year");
			$("input[name='job_application[educations][][school_name_id]']").attr("autocomplete", "custom-education-school-name");
			$("a[data-source='paste'][aria-labelledby='resume']")[0].dispatchEvent(new MouseEvent("click"));
			$(".school-name")[0].dispatchEvent(new MouseEvent("click"));
		// $("#s2id_education_school_name_0").addClass("select2-dropdown-open");
		// $("#select2-drop-mask").css("display", "block");
		// $(".select2-with-searchbox").css("display", "block");
		// $(".select2-with-searchbox").attr("id", "select2-drop");
		// $(".select2-input").addClass("select2-focused");
		case "www.liveworld.com":
			$("#first_name").attr("autocomplete", "given-name");
			$("#last_name").attr("autocomplete", "family-name");
			$("#email_address").attr("autocomplete", "email");
			$("#phone").attr("autocomplete", "tel");
			$("[name='facebook']").attr("autocomplete", "custom-question-facebook-profile");
			$("[name='instagram']").attr("autocomplete", "custom-question-instagram-profile");
			$("[name='twitter']").attr("autocomplete", "custom-question-instagram-profile");
			$("[name='education_diploma_obtained']").attr("autocomplete", "custom-education-degree");
			$("[name='certification_1").attr("autocomplete", "custom-certification-1");
			$("[name='certification_2").attr("autocomplete", "custom-certification-2");
			$("#skillset_email_program_used").attr("autocomplete", "custom-email-program");
			$("#skillset_IM_used").attr("autocomplete", "custom-instant-messenger");
			$("#skillset_browser_used").attr("autocomplete", "custom-browser");
			$("input[name='education_school_attended']").attr("autocomplete", "custom-education-school-name");
			$("#certify")[0].dispatchEvent(new MouseEvent("click"));
	}
};

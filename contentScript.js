console.log("content script is alive!");
let input = new Object();

$("input[name]").each(function() {
	input[$(this).attr("name")] = $(this).val();
});

console.log(input);

// Only collect inputs if it is not empty

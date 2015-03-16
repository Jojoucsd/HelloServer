var http = require('http');

function validateEmail() {
	var addressIsLegal = true;
	var eEntered = "ling @gmail.com"; //document.getElementByID("address").value;
	if (eEntered.indexOf(" ") !== -1) {
		addressIsLegal = false;
	}
	if (eEntered.indexOf("@") < 1 || eEntered.indexOf("@") > eEntered.length - 5) {
	addressIsLegal = false;
}
if (addressIsLegal === false) {
	//alert("Please correct email address");
	console.log("please correct email address.");
	return false;
}
}
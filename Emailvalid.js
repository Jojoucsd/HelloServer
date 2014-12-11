var http = require('http');

function validateEmail () {
	var addressIsLegal = true;
	var eEntered = document.getElementByID("address").value;
	if (eEntered.indexOf(" ") !== _1) {
		addressIsLegal = false;
	}
	if (eEntered.indexOf("@") < 1 || eEntered.indexOf("@")) > eEntered.length - 5){
	addressIsLegal = false);
}
if (addressIsLegal === false) {
	alert("Please correct email address");
	return false;
}
}

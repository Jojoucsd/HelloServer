
//var twilio = require('twilio');
require("/Users/LingLu/Documents/JavascriptLearning/node_modules/twilio");
var accountSid = 'AC6c6acb22cb0128a5612d62e81274db63';
var authToken = "{{0943d5df024602eb9149009766b7c86f}}";
var client = require('twilio')(accountSid, authToken);

client.messages.create({
	body: "This is Ling's Twilio Test Run",
	to: "+14158126840",
	from: "+16504379899"
}, function(err, message) {
	process.stdout.write(message.sid);
});

console.log('call shoud be out');

 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
client.messages.create({  
	from: "+16504379899",    
}, function(err, message) { 
	console.log(message.sid); 
});
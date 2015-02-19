"use strict";
var http = require('http');
var mongoose = require('mongoose');
var fs = require('fs');

var accountSid = 'AC6c6acb22cb0128a5612d62e81274db63';
var authToken = '0943d5df024602eb9149009766b7c86f';
var client = require('twilio')(accountSid, authToken);

mongoose.connect('mongodb://localhost/my_database');

var lingSchema = new mongoose.Schema({
	from: String,
	to: String,
	name: String,
	title: String,
	body: String,
	address: String,
	comment: [{
		body: String,
		date: Date
	}],
	date: {
		type: Date,
		default: Date.now
	}
});

var Email = mongoose.model('Email', lingSchema);
var emailArray = new Array();
for (var i = 0; i < 10; i++) {
	var email = new Email();
	email["from"] = 'Joy' + i.toString() + '@gmail.com';
	email["to"] = 'Ling' + i.toString() + '@gmail.com';
	email["name"] = 'Ling' + i.toString();
	email["title"] = 'Greeting' + i.toString();
	email["body"] = i.toString() + 'How are you and my number is 415-812-6840';
	email["address"] = 'Address:';
	emailArray.push(email);
}
console.log('Email' + emailArray);
for (var j = 0; j < 10; j++) {
	emailArray[j].save(function(err) {
		if (err) return console.error(err);
	});
}
console.log('finished');


function requestHandler(req, res) {
	var myInput = function(file, code, option) {
		fs.readFile(file, {
			endcoding: "utf8"
		}, function(err, data) {
			res.writeHead(code, {
				'Content-Type': option
			});
			if (err) throw err;
			res.write(data);
			res.end();
		});
	};
	var twCall = function(inputNum) {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		client.calls.create({
			to: inputNum,
			from: "+16504379899",
			url: "http://demo.twilio.com/docs/voice.xml",
			applicationSid: "APa894ccc18916d5496c35bbe7bd7f07bc",
			method: "GET",
			fallbackMethod: "GET",
			statusCallbackMethod: "GET",
			record: "false"
		}, function(err, call) {
			if (err) return console.error(err);
			console.log(call.sid);
			res.write("<h1>" + "Call Section ID:" + call.sid + "</h1>");
			res.end();
		});
	};
	var twText = function(inputNum) {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		client.messages.create({
			body: "This is Ling",
			to: inputNum,
			from: "+16504379899"
		}, function(err, message) {
			if (err) return console.error(err);
			console.log(message.sid);
			res.write("<h1>" + "Message Section ID:" + message.sid + "</h1>");
			res.end();
		});
	}
	if (req.url === "/bootstrap.css") {
		myInput("bootstrap.css", "200", "text/css");
	} else if (req.url === "/bootstrap.js") {
		myInput("bootstrap.js", "200", "text/js");
	} else if (req.url === "/body.html") {
		myInput("body.html", "404", "text/html");
	} else if (req.url === "/index.html") {
		fs.readFile("Emailvalid.html", {
			endocding: "utf8"
		}, function(err, data) {
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			if (err) throw err;
			res.write(data);
			res.end;
			fs.readFile("indexheader.html", {
				endocding: "utf8"
			}, function(err, data) {
				res.write('<h1>Email HomePage</h1>');
				Email.find({
					name: 'Ling8'
				}, function(err, found) {
					if (err) return console.error(err);
					console.log('err check');
					if (found) {
						for (var k = 0; k < found.length; k++) {
							res.write("<h2>" + "From: " + found[k].from + "</h2>");
							res.write("<h2>" + "Body: " + found[k].body + "</h2>");
							res.write("<a class='btn btn-default' href='call' role= 'button'>Call Now</a>");
							res.write("<a class='btn btn-default' href='text' role= 'button'>Text Now</a>");

						}
					};
					fs.readFile("indexfooter.html", {
						endocding: "utf8"
					}, function(err, data) {
						res.end("<h1>Finished my email test</h1>");
					});
				});
			});
		});
	} else if (req.url === "/call") {
		twCall("+14158126840");
	} else if (req.url === "/text") {
		twText("+14158126840");
	} else if (req.url === "/action") {
		req.on('data', function(chunk) {
			console.log("Received body data:");
			console.log(chunk.toString());
			var myDoc = new Email();

			myDoc["address"] = decodeURIComponent(chunk.toString().match(/address=(.*)/)[1]);

			console.log(myDoc);
			myDoc.save(function(err) {
				if (err) return console.error(err)
			});
		});
		req.on('end', function() {
			// empty 200 OK response for now
			res.writeHead(200, "OK", {
				'Content-Type': 'text/html'
			});
			res.write('<h1>New Input</h1>');
			Email.find({
				address: {
					$regex: '.com'
				}
			}, function(err, found) {
				debugger;
				if (err) return console.error(err);
				console.log('EM Address');
				if (found) {
					for (var n = 0; n < found.length; n++) {
						res.write("<h2>" + "New Input Address :" + found[n].address + "</h2>");
					};
					res.end("<h1>Finished my email test</h1>");
				};
			});
		});
	} else {
		myInput("panels.html", "200", "text/html");
	}
}
http.createServer(requestHandler).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
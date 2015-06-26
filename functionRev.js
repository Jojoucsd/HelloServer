"use strict";
var http = require('http');
var mongoose = require('mongoose');
var fs = require('fs');
var qs = require('querystring');

var connect = require('connect');
var app = connect();
var serveStatic = require('serve-static');

var keyIn ;
var accountSid = '';
var authToken = '';
var client = require('twilio')(accountSid, authToken);
mongoose.connect('mongodb://localhost/my_database');

var lingSchema = new mongoose.Schema({
	from: String,
	to: String,
	name: String,
	title: String,
	body: String,
	address: String,
	number: String,
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
	email["from"] = 'Joy ' + i.toString() + '@gmail.com';
	email["to"] = 'Ling ' + i.toString() + '@gmail.com';
	email["name"] = 'Ling ' + i.toString();
	email["title"] = 'Greeting ' + i.toString();
	email["body"] = 'How are you! ' + i.toString();
	email["address"] = 'My Address is ' + i.toString();
	email["number"] = 'My number is ' + i.toString();
	emailArray.push(email);
}
console.log('Email' + emailArray);
for (var j = 0; j < 10; j++) {
	emailArray[j].save(function(err) {
		if (err) return console.error(err);
	});
}
console.log('finished');

app.use (function(req, res, next) {
	function myInput(file, code, option, next) {
		fs.readFile(file, {
			encoding: "utf8"
		}, function(err, data) {
			res.writeHead(code, {
				'Content-Type': option
			});
			if (err) throw err;
			res.write(data);
			if (next) {
				next(function(err) {
					if (err) throw err;
				});
			} else {
				res.end();
			}
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
	};
	if (req.url === "/index.html") {
		console.log('hello');
		debugger;
		myInput("Emailvalid.html", "200", "text/html", function(cb) {
			console.log("hello");
			fs.readFile("httpHeader.html", {
				encoding: "utf8"
			}, function(err, data) {
				res.write('<h1>Email HomePage</h1>');
				Email.find({
					name: {
						$regex: 'Ling 8'
					},
			}, function(err, found) {
					if (err) return console.error(err);
					console.log('err check');
					if (found) {
						for (var k = 0; k < found.length; k++) {
							res.write("<h2>" + "From: " + found[k].from + "</h2>");
							res.write("<h2>" + "Body: " + found[k].body + "</h2>");
						}
					};
					fs.readFile("httpFooter.html", {
						encoding: "utf8"
					}, function(err, data) {
						res.write("<h1>Finished my email test</h1>");
						cb(null);
						res.end();
					});
				});
			});
		});
	} else if (req.url === "/call") {
		twCall(keyIn.number);
	} else if (req.url === "/text") {
		twText(keyIn.number);
	} else if (req.url === "/action") {
		req.on('data', function(chunk) {
			console.log("Received body data:");
			console.log(chunk.toString());
			keyIn = qs.parse(chunk.toString());
			console.log(keyIn);
			debugger;
			keyIn = new Email(keyIn);
			keyIn.save(function(err) {
				if (err) return console.error(err)
				console.log(err);
				console.log(keyIn.address);
				console.log(keyIn.number);
			});
		});
		req.on('end', function() {
			debugger;
			fs.readFile("httpHeader.html", {
				encoding: 'utf8'
			}, function(err, data) {
				res.writeHead(200, "OK", {
					'Content-Type': 'text/html'
				});
				if (err) throw err;
				res.write(data);
				res.write('<h1>New Input</h1>');
				Email.find({
					address: {
						$regex: '.com'
					},
					number: {
						$regex: ''
					},
				}, function(err, found) {
					debugger;
					if (err) return console.error(err);
					console.log('EM Address');
					if (found) {
						for (var n = 0; n < found.length; n++) {
							res.write("<h2>" + "User Input Address : " + found[n].address + "</h2>");
							res.write("<h1>" + "User Input Number : " + found[n].number + "</h1>");
							res.write("<a class='btn btn-default' href='call' role= 'button'>Call Now</a>");
							res.write("<a class='btn btn-default' href='text' role= 'button'>Text Now</a>");
						};
						res.end("<h1>Finish Ling Mail</h1>");
					};
				});
						fs.readFile("httpFooter.html", {
						encoding: "utf8"
					}, function(err, data) {
						res.write("<h1>Finished my email test</h1>");
					});
			});
		});
	} else {
		next();
	}
});
app.use('/action', function action (req, res, next) {
	if (req.url === "/action") {
		req.on('data', function(chunk) {
			console.log("Received body data:");
			console.log(chunk.toString());
			keyIn = qs.parse(chunk.toString());
			console.log(keyIn);
			debugger;
			keyIn = new Email(keyIn);
			keyIn.save(function(err) {
				if (err) return console.error(err)
				console.log(err);
				console.log(keyIn.address);
				console.log(keyIn.number);
			});
		});
		req.on('end', function() {
			debugger;
			fs.readFile("httpHeader.html", {
				encoding: 'utf8'
			}, function(err, data) {
				res.writeHead(200, "OK", {
					'Content-Type': 'text/html'
				});
				if (err) throw err;
				res.write(data);
				res.write('<h1>New Input</h1>');
				Email.find({
					address: {
						$regex: '.com'
					},
					number: {
						$regex: ''
					},
				}, function(err, found) {
					debugger;
					if (err) return console.error(err);
					console.log('EM Address');
					if (found) {
						for (var n = 0; n < found.length; n++) {
							res.write("<h2>" + "User Input Address : " + found[n].address + "</h2>");
							res.write("<h1>" + "User Input Number : " + found[n].number + "</h1>");
							res.write("<a class='btn btn-default' href='call' role= 'button'>Call Now</a>");
							res.write("<a class='btn btn-default' href='text' role= 'button'>Text Now</a>");
						};
						res.end("<h1>Finish Ling Mail</h1>");
					};
				});
						fs.readFile("httpFooter.html", {
						encoding: "utf8"
					}, function(err, data) {
						res.write("<h1>Finished my email test</h1>");
					});
			});
		});
};
next ();
});
/*app.use('/call', function callMiddleware(req, res, next){
	function twCall (inputNum) {
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
	next();
});
app.use(function myWrapper(req, res, next) {
	function myInput(file, code, option, next) {
		fs.readFile(file, {
			encoding: "utf8"
		}, function(err, data) {
			res.writeHead(code, {
				'Content-Type': option
			});
			if (err) throw err;
			res.write(data);
			if (next) {
				next(function(err) {
					if (err) throw err;
				});
			} else {
				res.end();
			}
		});
	};
});
app.use('/index.html', function printDatabase(req, res, next){
		myInput("Emailvalid.html", "200", "text/html", function(cb) {
			console.log("hello");
			fs.readFile("httpHeader.html", {
				encoding: "utf8"
			}, function(err, data) {
				res.write('<h1>Email HomePage</h1>');
				Email.find({
					name: {
						$regex: 'Ling 8'
					},
			}, function(err, found) {
					if (err) return console.error(err);
					console.log('err check');
					if (found) {
						for (var k = 0; k < found.length; k++) {
							res.write("<h2>" + "From: " + found[k].from + "</h2>");
							res.write("<h2>" + "Body: " + found[k].body + "</h2>");
						}
					};
					fs.readFile("httpFooter.html", {
						encoding: "utf8"
					}, function(err, data) {
						res.write("<h1>Finished my email test</h1>");
						cb(null);
						res.end();
					});
				});
			});
		});
		next();
	});*/ 
app.use(serveStatic("public", {'index': ['panels.html']}));
http.createServer(app).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
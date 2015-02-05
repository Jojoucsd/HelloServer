"use strict";
var http = require('http');
var mongoose = require('mongoose');
var fs = require('fs');
var ent = require('ent');

var accountSid = 'AC6c6acb22cb0128a5612d62e81274db63';
var authToken = '0943d5df024602eb9149009766b7c86f';
var client = require('twilio')(accountSid, authToken);

mongoose.connect('mongodb://localhost/my_database');
// local connection 

var schema = new mongoose.Schema({
	from: 'string',
	to: 'string',
	name: 'string',
	title: 'string',
	body: 'string',
	address: 'string'
});
//schema model setup to name array and varabile

var Email = mongoose.model('Email', schema);
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
//delcare Email is a schema that can generate data and push in to an array. Also saved in local database

function requestHandler(req, res) {
	if (req.url === "/bootstrap.css") {
		fs.readFile("bootstrap.css", {
			encoding: "utf8"
		}, function(err, data) {
			res.writeHead(200, {
				'Content-Type': 'text/css'
			});
			if (err) throw err;
			res.write(data);
			res.end();
			//funciont name is requestHandler does a read file and display 
		});
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
							res.write("<input type='button' value='Call Now'>");
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
		//four functions in the else if loop, should have give functions names 
	} else if (req.url === "/makecall") {
		debugger;
		client.messages.create({
			body: "This is Ling",
			to: "+14158126840",
			from: "+16504379899"
		}, function(err, message) {
			if (err) return console.error(err);
			console.log(message);

		});
	} 


		else if (req.url === "/bootstrap.js") {
		fs.readFile("bootstrap.js", {
			endcoding: "utf8"
		}, function(err, data) {
			res.writeHead(200, {
				'Content-Type': 'text/js'
			});
			if (err) throw err;
			res.write(data);
			res.end();
		});
		//another read function
	} else
	if (req.url === "/panels.html") {
		res.writeHead(404, {
			'Content-Type': 'text/html'
		});
		res.write('<h1>404, webpage not found</h1>');
		res.end();
		//error page if request is undefine
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
		//function chunk , used req.on to passing back variables back to data base and saved in an array
	} else {
		fs.readFile("panels.html", {
			encoding: "utf8"
		}, function(err, data) {
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			if (err) throw err;
			res.write(data);
			res.end();
		});
	}
}
http.createServer(requestHandler).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
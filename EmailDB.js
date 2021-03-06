var http = require('http');
//set up web use variables
var mongoose = require('mongoose');
//set up database
var fs = require('fs');
//read file command

mongoose.connect('mongodb://localhost/my_database');
//local mongodb connection

var schema = new mongoose.Schema({
	from: 'string',
	to: 'string',
	name: 'string',
	title: 'string',
	body: 'string'
});
//schema is the model of mongoose, set up runs through entire coding

var Email = mongoose.model('Email', schema);
var emailArray = new Array();
for (var i = 0; i < 10; i++) {
	var email = new Email();
	email["from"] = 'Joy' + i.toString() + '@gmail.com';
	email["to"] = 'Ling' + i.toString() + '@gmail.com';
	email["name"] = 'Ling' + i.toString();
	email["title"] = 'Greeting' + i.toString();
	email["body"] = i.toString() + 'How are you?';
	emailArray.push(email);
}
console.log('Email' + emailArray);
for (var j = 0; j < 10; j++) {
	emailArray[j].save(function(err) {
		if (err) return console.error(err);
	});
}
console.log('finished');
//delcare Email is a schema and generate data and push in to an array. The array saved in the database

//created a function name requestHandler, base on if and else commands 
function requestHandler(req, res) {
	debugger;
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
			//read file .css and display in webpage
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
	} else if (req.url === "/bootstrap.js") {
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
	} else
	if (req.url === "/panels.html") {
		res.writeHead(404, {
			'Content-Type': 'text/html'
		});
		res.write('<h1>404, webpage not found</h1>');
		res.end();
	} else if (req.url === "/action") {
		req.on('data', function(chunk) {
			console.log("Received body data:");
			console.log(chunk.toString());
			var inputEDB = chunk.toString().match(/Address=(.*)/);
			console.log(inputEDB);
			inputEDB.save(function(err){
			if (err) return console.error(err);
		});
		});

		req.on('end', function() {
			// empty 200 OK response for now
			res.writeHead(200, "OK", {
				'Content-Type': 'text/html'
			});
			res.end();
		});
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
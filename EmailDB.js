var http = require('http');
var mongoose = require('mongoose');
var fs = require('fs');

mongoose.connect('mongodb://localhost/my_database');
var schema = new mongoose.Schema({
	from: 'string',
	to: 'string',
	name: 'string',
	title: 'string',
	body: 'string'
});
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
		});
	} else if (req.url === "/panels.html") {
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
	} else if (req.url === "/modal.html") {
		fs.readFile("modal.html", {
			endcoding: "utf8"
		}, function(err, data) {
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			if (err) throw err;
			res.write(data);
			res.end();
		});
	} else {
		res.writeHead(404, {
			'Content-Type': 'text/html'
		});
		res.write('<h1>404, webpage not found</h1>');
		res.end();
	}
}
http.createServer(requestHandler).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
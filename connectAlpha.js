"use strict";
var http = require('http');

var fs = require('fs');
var qs = require('querystring');

var connect = require('connect');
var app = connect();
var serveStatic = require('serve-static');
var server = http.createServer(app);

var keyIn ;


app.use(function middleWare1(req, res, next) {
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
	next();
});

app.use(serveStatic("public", {'index': ['panels.html']}));
server.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
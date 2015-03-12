"use strict";
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

function requestHandler(req, res) {
	res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			res.write("Email:<br><input type='text' size = '30' onFocus='makeFieldYellow();' onBlur='makeFieldWhite();'>");
			var b1 = document.getElementById("button1");
			b1.onclick = sayHello;
			res.end();
	}
http.createServer(requestHandler).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
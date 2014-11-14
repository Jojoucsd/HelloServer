var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
	debugger;	// TODO take me out
  fs.readFile("index.html", {encoding : "utf8"}, function (err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end("Finished my call back");
  });
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
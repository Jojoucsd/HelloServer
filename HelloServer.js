var http = require('http');
var mongoose = require('mongoose');
var fs = require('fs');

// connecting to mongodb
mongoose.connect ('mongodb://localhost/my_database');
var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
  if (err) return console.error(err);
  console.log('meow');
});

// making http server
http.createServer(function (req, res) {
	debugger;	// TODO take me out
  fs.readFile("index.html", {encoding : "utf8"}, function (err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (err) throw err;
    res.write(data);
    fs.readFile("body.html", function (err, data) {
      res.write(data);
      // Find a Cat by name.
      Cat.findOne({ name: 'Zildjian'}, function(err, found){
        if (err) return console.error(err);
        console.log('Zildjian');
        if (found) {
          res.write("<h2>" +found.name+ "</h2>");
        }
        res.end("Finished my call back");
      });
      console.log("File 2 call back finished");
    });
    console.log("This is end");
  });
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
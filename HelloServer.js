var http = require('http');
http.createServer(function (req, res) {
	debugger;	
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h1> Hello World</h1>\n');
  res.write('<h1>Hello Counting Loop:</h1>');
  res.write("<br>");
   var count;
  res.write("Counts from 0 to 10" + "<br/>");
  for(count = 0; count <= 10; count ++){
  	res.write("Current Count:" + count);
  	res.write("<br />");
  }
  res.write("Count Stop!");
  res.write("<br />");
  res.write("<br />");
  res.write ("Number from 10 to 0" + "<br/>");
  for(count = 10; count >= 0; count --){
  	res.write("Number:" + count);
  	res.write("<br />");
  } 
  	res.write("Count Stop!");
  res.end('<h1>Yahoo! </h1><a href="http://yahoo.com"> homepage</a>\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
var http = require('http');
var mongoose = require( 'mongoose');
 
mongoose.connect( 'mongodb://localhost/my_database' );
var schema = new mongoose.Schema({
	from: 'string', to: 'string', name:'string', title: 'string', body: 'string'
});
var Email = mongoose.model('Email', schema);
var emailArray = new Array();
for (var i = 0; i < 10; i++) {
	var email = new Email();
	email["from"] = 'Joy' +i.toString() +'@gmail.com';
	email["to"] = 'Ling' +i.toString() +'@gmail.com';
	email["name"] = 'Ling' + i.toString();
	email["title"] = 'Greeting'+ i.toString();
	email["body"] = i.toString() +'How are you?';
	emailArray.push(email);
}
console.log('Email' +emailArray);
for (var j = 0; j < 10; j++) {
	emailArray[j].save(function (err) {
	if (err) return console.error(err);
	});
}
console.log('finished');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('Email HomePage');
	Email.findOne({ name: 'Ling8'}, function(err, found){
		if (err) return console.error(err);
		console.log('err check');
		if (found) {
			res.write("<h2>" +"From: " +found.from+ "</h2>");
			res.write("<h2>" +"To: " +found.to+ "</h2>");
			res.write("<h2>" +"Name: " +found.name+ "</h2>");
			res.write("<h2>" +"Title: " +found.title+ "</h2>");
			res.write("<h2>" +"Body: " +found.body+ "</h2>");
			res.end("Finished my email test");
		}
	})
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');


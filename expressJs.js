"use strict";
var http = require('http');
var mongoose = require('mongoose');
var fs = require('fs');
var qs = require('querystring');
var nodemailer = require('nodemailer');
var secret = require('./secret');
var express = require('express');
var app = express();
var serveStatic = require('serve-static');
/*var jadeStatic = require('connect-jade-static');
var path = require('path');*/

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: secret.nodemailer_user,
		pass: secret.nodemailer_pass
	}
});

var jade = require('jade');

var editInput;
var keyIn;
var accountSid = secret.twillio_sid;
var authToken = secret.twillio_token;
var client = require('twilio')(accountSid, authToken);
mongoose.connect('mongodb://localhost/my_database');

var lingSchema = new mongoose.Schema({
	from: String,
	to: String,
	name: String,
	CCaddress: String,
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
var mailOptions = {
	from: 'Ling Lu <linglu198282@gmail.com>',
	to: "",
	Cc: "",
	subject: "",
	text: "",
	html: "",
};

function twCall(inputNum, res) {
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
		res.render('food', {
			title: "twCall",
			message: "Call Section ID: " + call.sid,
			bravo: "Finish twCall"
		})
	});
};

function twText(inputNum, res) {
	client.messages.create({
		body: "This is Ling",
		to: keyIn.number,
		from: "+16504379899"
	}, function(err, message) {
		if (err) return console.error(err);
		console.log(message.sid);
		res.render('food', {
			title: "twText",
			message: "Message Section ID: " + message.sid,
			bravo: "Finish twText"
		})
	});
};
app.set('view engine', 'jade');
app.get('/hello', function(req, res) {
	res.render('hello', {
		title: 'Hey',
		message: 'Hello there!',
		address: 'linglu1982',
		phoneNumber: '4158126840',
		bravo: 'Ling Lu',
		youAreUsingJade: false
	});
});
app.all('/call', function callWraper(req, res, next) {
	twCall(keyIn.number, res);
});
app.all('/text', function textWraper(req, res, next) {
	twText(keyIn.number, res);
});
app.all('/sendMail', function sendMail(req, res, next) {
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error);
			res.render('hello', {
				title: "MailFail",
				message: "error"
			});
		} else {
			console.log('Message sent: ' + info.response);
			res.render('hello', {
				message: "Message sent" + info.response
			});
		}
	});
});
app.all('/index.html', function lingRoute(req, res, next) {
	Email.find({
		name: 'Ling 8'
	}, function(err, found) {
		if (err) return console.error(err);
		console.log('err check');
		if (found) {
			res.render('index', {
				title: 'MongoDB Results: ',
				message: 'Email HomePage',
				results: found,
				bravo: 'Finish Email Search'
			})
		};

	});
});
app.all('/action', function lingRoute2(req, res, next) {
	req.on('data', function(chunk) {
		console.log("Received body data:");
		console.log(chunk.toString());
		keyIn = qs.parse(chunk.toString());
		console.log(keyIn);
		keyIn = new Email(keyIn);
		mailOptions.to = keyIn.address;
		keyIn.save(function(err) {
			if (err) return console.error(err)
			console.log(err);
			console.log(keyIn.address);
			console.log(keyIn.number);
		});
	});
	req.on('end', function() {
		Email.find({
			address: {
				$regex: '.com'
			},
			number: {
				$regex: ''
			},
		}, function(err, found) {
			if (err) return console.error(err);
			console.log('EM Address');
			if (found) {
				res.render('iggy', {
					title: 'New Input',
					results: found,
					bravo: 'User Input Number :',
					foo: 'Finish Ling Mail',
					bar: 'Finished my email test'
				})
			}
		});
	});
});
app.all('/editon', function lingRoute3(req, res, next) {
	req.on('data', function(chunk) {
		console.log(chunk.toString());
		editInput = qs.parse(chunk.toString());
		console.log(editInput);
		editInput = new Email(editInput);
		mailOptions.to = editInput.address;
		mailOptions.Cc = editInput.CCaddress;
		mailOptions.subject = editInput.title;
		mailOptions.from = editInput.from;
		mailOptions.html = editInput.body;
		editInput.save(function(err) {
			if (err) return console.error(err)
			console.log(err);
		});
	});
	req.on('end', function() {
		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Message sent: ' + info.response);
				res.render('food', {
					title: 'New Input',
					message: 'Message sent: ' + info.response,
					bravo: 'Finished my email test'
				});
			}
		});
	});
});
/*app.use(jadeStatic({
	baseDir: path.join(__dirname,'/views/panel.jade'),
	baseUrl: '/panel',
	maxAge: 86400,
	jade: {pretty: true}
}));*/
app.use(serveStatic("public", {
	'index': ['panels.html']
}));
http.createServer(app).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
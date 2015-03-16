var http = require('http');
var fs = require('fs');

var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var now = new Date();
var theDay = now.getDay();
var nameOfToday = dayNames[theDay];

console.log(nameOfToday);
console.log(now);
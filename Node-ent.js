//var ent = require('ent');
//var encode = require('ent/encode');
//var decode = require('ent/decode');

//console.log(ent.encode('<span>©moo</span>'));
//console.log(ent.decode('&pi; &amp; &rho;'));
//console.log(ent.decode('%40'));
//console.log(ent.encode('Ling'));
//console.log(encode('ling@yahoo.com', { special: { '@': true } }));
//console.log(decode('ling&#64;yahoo.com', { special: { '&#64;': true } }));
//console.log(encode('hello', { special: { l: true } }));


var world = "ling%40yahoo.com";
var uri = 'email:' + decodeURIComponent(world);

//console.log(encodeURIComponent('\uD800\uDFFF'));

//console.log(encodeURIComponent('\uD800'));

//console.log(encodeURIComponent('\uDFFF'));
console.log(uri);

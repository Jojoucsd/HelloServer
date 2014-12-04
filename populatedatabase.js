//utility program to populate database
var mongoose = require('mongoose');

// connecting to mongodb
mongoose.connect ('mongodb://localhost/my_database');
var Cat = mongoose.model('Cat', { name: String });
var kittyArray = [];
for (var i = 0; i <10; i++) {
  console.log('hi');
  kittyArray[i] = new Cat({ name: 'Zildjian' + i.toString() });
}
console.log('hello' +kittyArray); 
for (var j = 0; j < 10; j++) {
  kittyArray[j].save(function (err) {
    if (err) return console.error(err);
    console.log('meow');
  });
}



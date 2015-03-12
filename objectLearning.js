function Plan(name, price, space, transfer, pages, discountMonths) {
	this.name = name;
	this.price = price;
	this.space = space;
	this.transfer = transfer;
	this.pages = pages;
	this.discountMonths = discountMonths;
};
Plan.prototype.calcAnnual = function(percentIfDisc) {
		var bestPrice = this.price;
		var currDate = new Date();
		var theMo = currDate.getMonth();
		for (var i = 0; i < this.discountMonths.length; i++) {
			if (this.discountMonths[i] === theMo) {
				bestPrice = this.price * percentIfDisc;
				break;
			}
		}
		return bestPrice * 12;
	}
var p1 = new Plan("Basic", 3.99, 100, 1000, 10, [6,7]);
var p2 = new Plan("Premium", 5.99, 500, 5000, 50, [6,7,11]);
var p3 = new Plan("Ultimate", 9.99, 2000, 20000, 500, [6,7]);
var annualPrice = p2.calcAnnual(.85);

var gotTheProperty = " " in p1;
var listOfProperties = [];
for (var prop in p1) {
	listOfProperties.push(prop);
}
var listOfProperties1 = [];
for (var prop in p2) {
	if (p2.hasOwnProperty(prop)) {
		listOfProperties1.push(prop);
	}
}
var isOwnedProperty = p3.hasOwnProperty("price");
console.log(isOwnedProperty);
console.log(listOfProperties);
console.log(listOfProperties1);
console.log(gotTheProperty);
console.log(p1.calcAnnual(.8));
console.log(annualPrice);
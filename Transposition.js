//npm install big-integer
var bigInt = require("big-integer");

var Transposition = function (p) {
	this.p = p;
};

/**
 * @param x a natural number
 * @return {number} the biggest prime that is smaller than x
 */
Transposition.prototype.findBiggestPrimeSmallerThan = function(x) {
	//throw "there is a bug here. 7997989 is always the answer"
	var big;
	for (var i=x-1; i>1; i--) {
		big = bigInt(i);
		if (big.isPrime()) {
			break;
		}
	}
	return big.toJSNumber();	
};

/**
 * @param g the possible generator - a natural number.
 * @param p the prime number which defines the group Z_p^*
 * @return {boolean} true iff all numbers [1,...,p-1] can be generated with powers of g.
 */
Transposition.prototype.isGenerator = function(g,p) {
	g = bigInt(g);
	var group = [];
	for (var i=1; i<p; i++) {
		var result = g.modPow(i,p);
		group.push(result);
		if (result.toJSNumber() === 1 && group.length < p - 1) {
			return false;
		}
	}
	return true;
};

/**
 * @param p a prime number defining the group Z_p^*
 * @return {number} the smallest possible generator of Z_p^*
 */
Transposition.prototype.smallestGeneratorOf = function(p) {
	if (!bigInt(p).isPrime()) {
		throw "p must be prime";
	}
	for (var i=2; i<p-1; i++) {
		if (this.isGenerator(i,p)) {
			return i;
		}
	}
};

/**
 * @param x an even number
 * @return {Array} all co-primes of x
 */
Transposition.prototype.coPrimes = function(x) {
	if (x % 2 == 1) {
		throw "p is assumed to be non-prime and even (as it is a prime minus 1)";
	}
	function euclid(a, b) {
		while (b != 0) {
			var r = a % b;
			a = b;
			b = r;
		}
		return a;
	}
	var coprimes = [];
	for (var i=3; i<x; i+=2) {
		if (euclid(i,x) == 1) {
			coprimes.push(i);
		}
	}
	return coprimes;
};

/**
 * @param g generator for Z_p^*
 * @param p prime number which defines Z_p^*
 * @param limit - (Optional) limit how many numbers in the group to generate. If not provided then there is no limit.
 * @return {Array} the cyclic group in the order found by the sequence of exponents from 1 to p-1
 */
Transposition.prototype.generateCyclicGroup = function(g,p,limit) {
	if (!limit) {
		limit = p-1;
	}
	var big = bigInt(g);
	var cyclicGroup = [];
	var lastElement = 0;
	for (var i=1; lastElement !== 1 && i <= limit; i++) {
		lastElement = big.modPow(i,p).toJSNumber();
		cyclicGroup.push(lastElement);
	}
	return cyclicGroup;
};

Transposition.prototype.randomArrayIndex = function(size) {
	var r = Math.random();
	return Math.floor(r * (size-1));
};

Transposition.prototype.sendUIEvent = function(msg) {
	console.log(msg);
};

Transposition.prototype.encrypt = function() {
	return this.algorithm(this.p);
};

Transposition.prototype.decrypt = function(i) {
	return this.algorithm(this.p,i)
};

Transposition.prototype.algorithm = function(n, generatorIndex) {
	if (generatorIndex === undefined) {
		this.sendUIEvent("encrypting...")
	} else {
		this.sendUIEvent("decrypting...")
	}
	this.sendUIEvent("Finding biggest prime smaller than input");
	var p = this.findBiggestPrimeSmallerThan(n);
	this.sendUIEvent("biggest prime smaller than input = "+p);
	this.sendUIEvent("finding smallest genertor for "+p+"...");
	var g = this.smallestGeneratorOf(p);
	this.sendUIEvent("smallest generator found = "+g);
	var generatorPowers = this.coPrimes(p-1);
	this.sendUIEvent("number of generator powers found = "+generatorPowers.length);
	if (generatorIndex === undefined) {
		generatorIndex = this.randomArrayIndex(generatorPowers.length);
	}
	var generatorPower = generatorPowers[generatorIndex];
	this.sendUIEvent("picked random power = " + generatorPower);
	var newGenerator = bigInt(g).modPow(generatorPower,p).toJSNumber();
	this.sendUIEvent("using generator = "+newGenerator);
	this.sendUIEvent("generating cyclic group");
	this.sendUIEvent(this.generateCyclicGroup(newGenerator, p));
	return generatorIndex;
};

var transposition = new Transposition(100*100*3);
var g = transposition.encrypt();
transposition.decrypt(g);
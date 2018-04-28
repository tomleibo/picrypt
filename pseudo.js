
/*pseudo algorithm:
1. size = image pixels * 3.
2. find p such that p < size and there is no p' such that p' is prime and p < p'
3. g = find smallest generator of p
4. find all other generators. 
	4.1. coprimes =  find all co-primes to p.
	4.2. generators are: g^coprimes1, g^coprimes2
	4.3. random = pick a random number in the list of coprimes.
	4.4. find the first generator which is bigger than random
5.


 https://math.stackexchange.com/questions/786452/how-to-find-a-generator-of-a-cyclic-group
5. 

Use https://github.com/peterolson/BigInteger.js

Miller rabin tests:
isGenerator:

finding biggest prime:
*/
var bigInt = require("big-integer");
function findBiggestPrimeSmallerThan(x) {
	//throw "there is a bug here. 7997989 is always the answer"
	var big;
	for (var i=x-1; i>1; i--) {
		big = bigInt(i);
		if (big.isPrime()) {
			break;
		}
	}
	return big.toJSNumber();	
}

function isGenerator(g,p) {
	var g = bigInt(g);
	var group = [];
	for (var i=1; i<p; i++) {
		var result = g.modPow(i,p);
		group.push(result);
		if (result.toJSNumber() === 1 && group.length < p - 1) {
			/*if (DEBUG) {
				console.log("found bad power " + i + " result = "+result+ " and group size is :" + group.length);
			}*/
			return false;
		}
	}
	return true;
}

function smallestGeneratorOf(p) {
	if (!bigInt(p).isPrime()) {
		throw "p must be prime";
	}
	for (var i=2; i<p-1; i++) {
		console.log("checking "+i);
		if (isGenerator(i,p)) {
			return i;
		}
	}
}


// co primes
function coPrimes(p) {
	if (p % 2 == 1) {
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
	for (var i=3; i<p; i+=2) {
		if (euclid(i,p) == 1) {
			coprimes.push(i);
		}
	}
	return coprimes;
}

function generateCyclicGroup(g,p,limit) {
	if (!limit) {
		limit = p-1;
	}
	var big = bigInt(g);
	var cyclicGroup = [];
	lastElement = 0;
	for (var i=1; lastElement !== 1 && i <= limit; i++) {
		lastElement = big.modPow(i,p).toJSNumber();
		cyclicGroup.push(lastElement);
	}
	return cyclicGroup;
}

function randomArrayIndex(size) {
	var r = Math.random();
	return Math.floor(r * (size-1));
}



function algorithm(n) {
	console.log("input = "+n);
	var p = findBiggestPrimeSmallerThan(n);
	console.log("biggest prime smaller than input = "+p);
	console.log("finding smallest genertor for "+p+"...");
	var g = smallestGeneratorOf(p);
	console.log("smallest generator found = "+g);
	var generatorPowers = coPrimes(p-1);
	console.log("number of generator powers found = "+generatorPowers.length);
	var randomPower = randomArrayIndex(generatorPowers.length);
	var generatorPower = generatorPowers[randomPower];
	console.log("picked random power = " + generatorPower);
	var newGenerator = bigInt(g).modPow(generatorPower,p).toJSNumber();
	console.log("found new possible generator = "+newGenerator);
	console.log("checking if new number is actually generator... ");
	console.log(isGenerator(newGenerator,p));
	var limit = 10;
	console.log("generating cyclic group with limit = "+limit);
	console.log(generateCyclicGroup(newGenerator, p, limit));
}

algorithm(1333*1333);
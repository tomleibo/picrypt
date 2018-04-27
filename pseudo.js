
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
	function euclid(a, b) {
		while (b != 0) {
			var r = a % b;
			a = b;
			b = r;
		}
		return a;
	}
	// p is assumed to be non-prime and even 
	var coprimes = [];
	for (var i=3; i<p; i+=2) {
		if (euclid(i,p) == 1) {
			coprimes.push(i);
		}
	}
	return coprimes;
}

var p = findBiggestPrimeSmallerThan(12000000);
console.log(coPrimes(p-1));
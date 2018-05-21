//npm install big-integer
//var bigInt = require("big-integer");

import bigInt from "big-integer";

export var Transposition = function (n) {
	this.p = this.findBiggestPrimeSmallerThan(n);
};

/**
 * Checks if a number is prime or not. Based on Fermat's primality test.
 * @param x positive integer
 * @return {boolean} is x prime
 */
Transposition.prototype.isPrime = function (x) {
	var isPrime = this.isBasicPrime(x);
	if (isPrime !== undefined) {
		return isPrime;
	}
    return !this.isComposite(x);
};

/**
 * An implementation of Fermat's primality test.
 * @param x a positive integer
 * @return boolean true, if the number was found to be composite, or, undefined otherwise.
 */
Transposition.prototype.isComposite = function (p) {
	const FERMAT_TEST_COUNT = 100;
	for (var i = 0; i < FERMAT_TEST_COUNT; i++) {
		var rand =  Math.floor(Math.random() * (p - 3) + 2);
		if (bigInt(rand).modPow(p-1,p).toJSNumber() !== 1) {
			return true;
		}
	}
};

/**
 * Tests some basic cases for integer primality. Is designed to be run before Miller Rabin tests are performed.
 * @param x a positive integer
 * @return {boolean} true if prime, false if composite or, undefined if no definite answer can be given.
 */
Transposition.prototype.isBasicPrime = function (x) {
	if (x == 1 || x == 2 || x == 3 || x == 5 || x == 7) {
		return true;
	}
	if (x % 2 == 0 || x % 3 == 0 || x % 5 == 0 || x % 7 == 0) {
		return false;
	}
};

/**
 * @param x a natural number
 * @return {number} the biggest prime that is smaller than x
 */
Transposition.prototype.findBiggestPrimeSmallerThan = function(x) {
	for (var i = x-1; i>1; i--) {
		if (this.isPrime(i)) {
			break;
		}
	}
	return i;
};

/**
 * @param g the possible generator - a natural number.
 * @return {boolean} true iff all numbers [1,...,p-1] can be generated with powers of g.
 */
Transposition.prototype.isGenerator = function(g) {
	g = bigInt(g);
	var group = [];
	for (var i=1; i<this.p; i++) {
		var result = g.modPow(i,this.p);
		group.push(result);
		if (result.toJSNumber() === 1 && group.length < this.p - 1) {
			return false;
		}
	}
	return true;
};

/**
 * @return {number} the smallest possible generator of Z_p^*
 */
Transposition.prototype.smallestGenerator = function () {
	for (var i=2; i<this.p-1; i++) {
		if (this.isGenerator(i)) {
			return i;
		}
	}
};

/**
 * @return {Array} all co-primes of p-1
 */
Transposition.prototype.findGeneratorPowers = function() {
	var x = this.p - 1;
	var coprimes = [];
	for (var i=3; i<x; i+=2) {
		if (this.gcd(i,x) == 1) {
			coprimes.push(i);
		}
	}
	return coprimes;
};

Transposition.prototype.gcd = function(a, b) {
	while (b != 0) {
		var r = a % b;
		a = b;
		b = r;
	}
	return a;
};

/**
 * @param g generator for Z_p^*
 * @param limit - (Optional) limit how many numbers in the group to generate. If not provided then there is no limit.
 * @return {Array} the cyclic group in the order found by the sequence of exponents from 1 to p-1
 */
Transposition.prototype.generateCyclicGroup = function(g,limit) {
	if (!limit) {
		limit = this.p-1;
	}
	var big = bigInt(g);
	var cyclicGroup = [];
	var lastElement = 0;
	for (var i=1; lastElement !== 1 && i <= limit; i++) {
		lastElement = big.modPow(i,this.p).toJSNumber();
		cyclicGroup.push(lastElement);
	}
	return cyclicGroup;
};

Transposition.prototype.randomArrayIndex = function(size) {
	var r = Math.random();
	return Math.floor(r * (size-1));
};

Transposition.prototype.sendUIEvent = function(msg) {
	postMessage({progressMsg:msg})
};

Transposition.prototype.generate = function() {
	return this.algorithm(this.p);
};



Transposition.prototype.restore = function(i) {
	return this.algorithm(this.p,i)
};

Transposition.prototype.algorithm = function(n, generatorIndex) {
	if (generatorIndex === undefined) {
		this.sendUIEvent("encrypting...")
	} else {
		this.sendUIEvent("decrypting...")
	}
	this.sendUIEvent("biggest prime smaller than input = "+this.p);
	this.sendUIEvent("finding smallest genertor for "+this.p+"...");
	var g = this.smallestGenerator();
	this.sendUIEvent("smallest generator found = "+g);
	var generatorPowers = this.findGeneratorPowers();
	this.sendUIEvent("number of generator powers found = "+generatorPowers.length);
	if (generatorIndex === undefined) {
		generatorIndex = this.randomArrayIndex(generatorPowers.length);
	}
	var generatorPower = generatorPowers[generatorIndex];
	this.sendUIEvent("picked random power = " + generatorPower);
	var newGenerator = bigInt(g).modPow(generatorPower,this.p).toJSNumber();
	this.sendUIEvent("using generator = "+newGenerator);
	this.sendUIEvent("generating cyclic group");
    var cyclicGroup = this.generateCyclicGroup(newGenerator);
	return { index: generatorIndex, group: cyclicGroup};
};

Transposition.prototype.stringToBin = function(input) {
	var result = "";
	for (var i = 0; i < input.length; i++) {
		var byte = input[i].charCodeAt(0).toString(2);
		while (byte.length < 8) byte = "0" + byte;
		result += byte;
	}
	return result;
};

/**
 * @param i original index of the string
 * @return {number} index in an imageData which contains alpha values
 */
Transposition.prototype.groupIndexToPixelIndex = function (i){
    return Math.floor(i/3)*4 + (i%3);
};

/**
 conceals the plain text in the image by converting 0 to even color value and 1 to odd color value.
 * imageData is received as an array of size width*height*4 for RGB and alpha. We ignore the alpha value.
 * @param plainText string to conceal
 * @param pixelData array of colors of size width*height*4 as received from canvas.getContext('2d').getImageData
 * @param cyclicGroup the cyclicGroup as generated by the generator and in the same order.
 * @return {Array} pixel data after modification
 */
Transposition.prototype.conceal = function(plainText, pixelData, cyclicGroup) {
    var binaryText = this.stringToBin(plainText);
    if (binaryText.length > cyclicGroup.length) {
        throw "binary text is bigger than pixel data size";
    }
    console.log("concealing " + binaryText);
    var pixel;
    for (var i in binaryText) {
        var pixelIndex = cyclicGroup[i];
        pixel = pixelData[pixelIndex];
        var bitIsSet = binaryText[i] == '1';
        var pixelIsEven = pixel % 2 == 0;
        if (pixelIsEven && bitIsSet) {
            pixelData[pixelIndex] = pixel + 1;
        } else if (!pixelIsEven && !bitIsSet) {
            pixelData[pixelIndex] = pixel - 1;
        }
    }
    return pixelData;
};

/**
 * receives imageData as given from the canvas context get image data method and reveals the message by checking which pixels are odd and even
 * @param pixelData
 * @param cyclicGroup
 * @param length
 * @return {string} original string in plaintext
 */
Transposition.prototype.reveal = function(pixelData, cyclicGroup, length) {
    var binary = "";
    for (var i = 0; i<length; i++) {
        var pixelIndex = cyclicGroup[i];
        binary += pixelData[pixelIndex] % 2 == 0 ? "0" : "1";
    }
    var result = "";
    for (i=0; i<binary.length; i+=8) {
        result += String.fromCharCode(parseInt(binary.substr(i,8),2));
    }
    return result;
};

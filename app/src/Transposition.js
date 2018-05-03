/**
 * TODO
 * implement draw which is connected to GUi
 * optional - implement our own isPrime function
 * optional^2 - implement our own modPow
 */

//npm install big-integer
var bigInt = require("big-integer");

var Transposition = function (n) {
	this.p = this.findBiggestPrimeSmallerThan(n);
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
	//console.log(msg);
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
	return { "index": generatorIndex, "group": cyclicGroup};
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
        var pixelIndex = this.groupIndexToPixelIndex(cyclicGroup[i]);
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
        var pixelIndex = this.groupIndexToPixelIndex(cyclicGroup[i]);
        if (pixelData[pixelIndex] % 2 == 0) {
            binary += "0";
        } else {
            binary += "1";
        }
    }
    var result = "";
    for (i=0; i<binary.length; i+=8) {
        result += String.fromCharCode(parseInt(binary.substr(i,8),2));
    }
    return result;
};


//TODO connect with image uploaded and draw onto a real canvas
Transposition.prototype.draw = function (elementId,plainText) {
	var canvas = document.getElementById(elementId);
	var binaryPT = this.stringToBin(plainText);
	var ctx = canvas.getContext('2d');
	var img = new Image();
	img.onload = function() {
		ctx.drawImage(img,0,0);
		var pixelData = ctx.getImageData(0, 0, img.width, img.height);
		// actual size is X4 than that, but we want to use only the alpha??
		var colorDataLength = img.width * img.height;
		for (var i=0; i<binaryPT.length; i++) {
			if (binaryPT[i] === "1") {
				pixelData.data[i*4+3]--;
			}
		}
		ctx.putImageData(pixelData,0,0);
	};
	//img.src = srcElement.value;
	img.src = data;


};

/* test to see that encode and decode match
var transposition = new Transposition(100*100*3);
var g = transposition.generate();
transposition.restore(g);
*/


var pixelData2 = [1,2,3,4,5,6,7,8,255,254,253,123,124,125,234,235];
var pixelData3 = [1,2,3,0,4,5,6,0,7,8,255,0,254,253,123,0,124,125,234,0,235];
console.log(pixelData2);
var t = new Transposition(pixelData2.length);
var result = t.generate();
console.log(result.group);
var newData = t.conceal("p", pixelData3, result.group);
console.log(newData);
console.log(t.reveal(newData, result.group, 8));

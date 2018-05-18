import {Transposition} from "../Transposition";

let BMP_HEADER_SIZE = 55;
let removeBmpHeader = function (imageData) {
    let pixels = new Uint8Array(imageData.length - BMP_HEADER_SIZE);
    for (let i = BMP_HEADER_SIZE; i < imageData.length; i++) {
        pixels[i - BMP_HEADER_SIZE] = imageData[i]
    }
    return pixels;
};
let updateImage = function (imageData, pixels) {
    for (let i = 0; i < imageData.length; i++) {
        imageData[i + BMP_HEADER_SIZE] = pixels[i]
    }
};

onmessage = function(e) {

    console.log('Message received from main script with keys:' + Object.keys(e.data[0]));
    const imageData          = e.data[0].imageData;
    const encryptedPlaintext = e.data[0].encryptedPlaintext;

    let pixels = removeBmpHeader(imageData);

    const transposition      = new Transposition(pixels.length);
    const {index, group} = transposition.generate();

    transposition.conceal(
        encryptedPlaintext,
        pixels,
        group
    );
    let encryptedMessageLenInBits = transposition.stringToBin(
        encryptedPlaintext
    ).length;
    updateImage(
        imageData,
        pixels
    );
    console.log('Posting message back to main script');
    postMessage(
        {
            index,
            encryptedMessageLenInBits,
            data:imageData
        });
};
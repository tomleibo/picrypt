import {Transposition} from "../Transposition";
import CryptoJs from "crypto-js";

const BMP_HEADER_SIZE = 55;

const removeBmpHeader = (imageData) => {

    let pixels = new Uint8Array(imageData.length - BMP_HEADER_SIZE);
    for (let i = 0; i < imageData.length - BMP_HEADER_SIZE; i++) {
        pixels[i] = imageData[i + BMP_HEADER_SIZE]
    }
    return pixels;
};


onmessage = function (e) {

    const imageBytes                = e.data.imageBytes;
    const cyclicGroupIdx            = e.data.cyclicGroupIdx;
    const encryptedMessageLenInBits = e.data.encryptedMessageLenInBits;
    const encryptionKey             = e.data.encryptionKey;

    const trans = new Transposition(
        imageBytes.length - BMP_HEADER_SIZE
    );
    let {index,group} = trans.restore(
        cyclicGroupIdx
    );

    let pixels = removeBmpHeader(imageBytes);

    let decodedMessage = trans.reveal(
        pixels,
        group,
        encryptedMessageLenInBits
    );

    console.log(`about to decrypt: ${decodedMessage}`);
    decodedMessage = CryptoJs.AES.decrypt(
        decodedMessage,
        encryptionKey
    ).toString(CryptoJs.enc.Utf8);

    console.log("posting message back to script...");
    postMessage({decodedMessage})

};
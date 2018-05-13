import {Transposition} from "./Transposition";

onmessage = function(e) {

    console.log('Message received from main script with keys:' + Object.keys(e.data[0]));
    const imageData          = e.data[0].imageData;
    let pixels = new Uint8Array(imageData.length);
    const encryptedPlaintext = e.data[0].encryptedPlaintext;
    for(let i = 55; i< imageData.length;i++){
        pixels[i]=imageData[i]
    }
    const transposition      = new Transposition(pixels.length);

    const {index, group} = transposition.generate();

    transposition.conceal(
        encryptedPlaintext,
        pixels,
        group);

    for(let i = 55; i< imageData.length;i++){
        imageData[i] = pixels[i]
    }

    console.log('Posting message back to main script');
    postMessage(
        {
            index,
            encryptedMessageLenInBits:transposition
                .stringToBin(encryptedPlaintext).length,
            data:imageData
        });
};
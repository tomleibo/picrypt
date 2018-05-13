import {Transposition} from "./Transposition";

onmessage = function(e) {

    console.log('Message received from main script with keys:' + Object.keys(e.data[0]));
    const pixels = [];
    const imageData          = e.data[0].imageData;
    const encryptedPlaintext = e.data[0].encryptedPlaintext;
    for(let i = 100; i< imageData.length;i++){
        pixels.push(imageData[i])
    }
    const transposition      = new Transposition(pixels.length);

    const {index, group} = transposition.generate();

    transposition.conceal(
        encryptedPlaintext,
        pixels,
        group);

    for(let i = 100; i< imageData.length;i++){
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
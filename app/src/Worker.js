import {Transposition} from "./Transposition";


onmessage = function(e) {

    console.log('Message received from main script with keys:' + Object.keys(e.data[0]));
    const imageData          = e.data[0].imageData;
    let BMP_HEADER_SIZE = 55;
    const encryptedPlaintext = e.data[0].encryptedPlaintext;

    let pixels = new Uint8Array(imageData.length-BMP_HEADER_SIZE);
    for(let i = BMP_HEADER_SIZE; i< imageData.length;i++){
        pixels[i-BMP_HEADER_SIZE]=imageData[i]
    }

    const transposition      = new Transposition(pixels.length);

    const {index, group} = transposition.generate();

    transposition.conceal(
        encryptedPlaintext,
        pixels,
        group
    );

    let encryptedMessageLenInBits = transposition
        .stringToBin(encryptedPlaintext).length;




    for(let i = 0; i< imageData.length;i++){
        imageData[i+BMP_HEADER_SIZE] = pixels[i]
    }






    let reveal = transposition.reveal(
        pix,
        group,
        encryptedMessageLenInBits
    );

    console.log(`encryptedPlaintext: ${encryptedPlaintext}`);
    console.log(`reveal: ${reveal}`);

    console.log('Posting message back to main script');
    postMessage(
        {
            index,
            encryptedMessageLenInBits,
            data:imageData
        });
};
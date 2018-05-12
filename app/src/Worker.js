import {Transposition} from "./Transposition";

onmessage = function(e) {

    console.log('Message received from main script with keys:' + Object.keys(e.data[0]));
    const imageData          = e.data[0].imageData;
    const encryptedPlaintext = e.data[0].encryptedPlaintext;

    const transposition      = new Transposition(imageData.length);
    console.log("about to generate...");
    const {index, group} = transposition.generate();
    console.log(`group is ${group} index is: ${index}`);
    const encryptedMessageLenInBits = transposition
        .stringToBin(encryptedPlaintext);


    console.log('Posting message back to main script');
    postMessage(
        {
            index,
            encryptedMessageLenInBits,
            group
        });
};
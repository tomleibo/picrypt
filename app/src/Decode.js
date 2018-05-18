import React from "react";
import {Button, ControlLabel, FormControl, FormGroup, HelpBlock} from "react-bootstrap";
import {Transposition} from "./Transposition";
import CryptoJs from "crypto-js";

export class DecodeForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.setEncryptionKey = this.setEncryptionKey.bind(this);
        this.setMessageLen = this.setMessageLen.bind(this);
        this.setCyclicGroupIndex = this.setCyclicGroupIndex.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            encryptionKey: '',
            encryptedMessageLenInBits: '',
            cyclicGroupIdx: '',
            decodedMessage: '',
            imageBytes: ''
        };
    }

    getValidationState() {
        const length = this.state.encryptionKey.length;
        if (length === 26) return 'success';
        else if (length === 0) return null;
        else return 'error';
    }

    validBitLen() {
        const len = this.state.encryptedMessageLenInBits;
        if (parseInt(len)) return 'success';
        else if (len === '') return null;
        else return 'error';
    }

    validCyclicGroupIdx() {
        const len = this.state.cyclicGroupIdx;
        if (parseInt(len)) return 'success';
        else if (len === '') return null;
        else return 'error';
    }

    setEncryptionKey(e) {
        this.setState({encryptionKey: e.target.value});
    }
    setCyclicGroupIndex(e) {
        this.setState({cyclicGroupIdx: e.target.value});
    }
    setMessageLen(e) {
        this.setState({encryptedMessageLenInBits: e.target.value});
    }

    handleImage(e) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onload = () => {
            this.setState({imageBytes: new Uint8Array(reader.result)});
        }
    }

    onSubmit(e) {
        e.preventDefault();
        const BMP_HEADER_SIZE = 55;
        const trans = new Transposition(this.state.imageBytes.length - BMP_HEADER_SIZE);
        let {index,group} = trans.restore(this.state.cyclicGroupIdx);
        let pixels = this.removeBmpHeader(BMP_HEADER_SIZE);

        let decodedMessage = trans.reveal(
            pixels,
            group,
            this.state.encryptedMessageLenInBits
        );
        console.log(`encrypted: ${decodedMessage}`);
        decodedMessage = CryptoJs.AES.decrypt(
            decodedMessage,
            this.state.encryptionKey
        ).toString(CryptoJs.enc.Utf8);

        console.log(`decrypted: ${decodedMessage}`);
        this.setState({decodedMessage});
    }

    removeBmpHeader(BMP_HEADER_SIZE) {
        const imageData = this.state.imageBytes;

        let pixels = new Uint8Array(imageData.length - BMP_HEADER_SIZE);
        for (let i = 0; i < imageData.length - BMP_HEADER_SIZE; i++) {
            pixels[i] = imageData[i + BMP_HEADER_SIZE]
        }
        return pixels;
    }

    render() {
        return (
            <form>
                <hr/>
                <FormGroup
                    controlId="formBasicText"
                    validationState={this.getValidationState()}>
                    <ControlLabel>top secret encryption key</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.encryptionKey}
                        placeholder="Encryption Key"
                        onChange={this.setEncryptionKey}/>
                    <FormControl.Feedback/>
                    <HelpBlock>encryption key must be a permutation of [a-z], 26 characters.</HelpBlock>
                </FormGroup>
                <FormGroup
                    controlId="formBasicText"
                    validationState={this.validBitLen()}>
                    <ControlLabel>encrypted Message Len In Bits</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.encryptedMessageLenInBits}
                        placeholder="..."
                        onChange={this.setMessageLen}/>
                    <FormControl.Feedback/>
                    <HelpBlock>we use it as part of the encryption key</HelpBlock>
                </FormGroup>
                <FormGroup
                    controlId="formBasicText"
                    validationState={this.validCyclicGroupIdx()}>
                    <ControlLabel>cyclic Group Idx</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.cyclicGroupIdx}
                        placeholder="cyclic Group Idx"
                        onChange={this.setCyclicGroupIndex}/>
                    <FormControl.Feedback/>
                    <HelpBlock>this is the index of the generator</HelpBlock>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Injected Image</ControlLabel>
                    <FormControl
                        type="file"
                        placeholder="Select injected image"
                        onChange={this.handleImage}/>
                    <FormControl.Feedback/>
                    <HelpBlock>Cat images are not allowed.</HelpBlock>
                </FormGroup>
                <Button type="submit" bsStyle="primary" onClick={this.onSubmit}>Decode</Button>
                <hr/>
                <FormGroup>
                    <ControlLabel>Message</ControlLabel>
                    <FormControl
                        readOnly
                        componentClass="textarea"
                        type="text"
                        placeholder="decoded and decrypted message"
                        value={this.state.decodedMessage}/>
                    <FormControl.Feedback/>
                </FormGroup>
            </form>


        );
    }
}
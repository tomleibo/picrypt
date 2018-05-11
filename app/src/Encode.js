import React from "react";
import {Button, Col, ControlLabel, FormControl, FormGroup, Grid, HelpBlock, Row, Thumbnail} from "react-bootstrap";
import CryptoJs from "crypto-js";

import { Transposition} from "./Transposition";

export class EncodeForm extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleImage = this.handleImage.bind(this);

        this.state = {
            plainText: '',
            imageBytes: '',
            imageBytesAfterEncoding: '',
            encryptionKey: ''
        };
    }

    getValidationState() {
        const length = this.state.plainText.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    handleChange(e) {
        this.setState({plainText: e.target.value});

    }

    onSubmit(e) {
        e.preventDefault();

        const encryptionKey = this.randomKey();
        this.setState({encryptionKey: encryptionKey});
        this.setState({
                imageBytesAfterEncoding: this.injectCipherText(
                    this.encrypt(encryptionKey))
            }
        );

    }

    injectCipherText() {

        // let cyclicGroup = tom.generate();
        const canvas = document.getElementById("banana");
        const ctx = canvas.getContext("2d");
        let image = document.images[0];
        ctx.drawImage(image,0,0);

        let imageData = ctx.getImageData(0,0,image.width,image.height);
        const tom = new Transposition(imageData.data.length);
        const { index, group } = tom.generate();
        let originalData = JSON.parse(JSON.stringify(imageData.data));
        let pic = tom.conceal(this.state.plainText, imageData.data, group);

        ctx.putImageData(imageData,0,0);

        const da = 1;

        // let conceal = tom.conceal(
        //     this.state.plainText,
        //     this.state.imageBytes,
        //     cyclicGroup.group
        // );
        return this.state.imageBytes;
    }

    encrypt(key) {
        return CryptoJs.AES.encrypt(this.state.plainText, key).toString();
    }


    randomKey() {
        const randomArray = new Uint32Array(26);
        window.crypto.getRandomValues(randomArray);
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        return alphabet.sort((a, b) =>
            randomArray[alphabet.indexOf(a)] - randomArray[alphabet.indexOf(b)]
        ).reduce((a, b) => a + b);


    }

    handleImage(e) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onload = () => {
            const arrayBuffer = reader.result;
            const array = new Uint8Array(arrayBuffer);
            this.setState({imageBytes: String.fromCharCode.apply(null, array)});
        }
    }

    render() {
        return (
            <div>
                <hr/>
                <form>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.getValidationState()}>
                        <ControlLabel>top secret message</ControlLabel>
                        <FormControl
                            type="text"
                            componentClass="textarea"
                            value={this.state.plainText}
                            placeholder="Enter top secret message"
                            onChange={this.handleChange}/>
                        <FormControl.Feedback/>
                        <HelpBlock>Please use proper English.</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Innocent image </ControlLabel>
                        <FormControl
                            type="file"
                            placeholder="Select innocent image"
                            accept=".bmp"
                            onChange={this.handleImage}/>
                        <FormControl.Feedback/>
                        <HelpBlock>Only .bmp cat images allowed.</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Encryption Key</ControlLabel>
                        <FormControl
                            readOnly
                            type="text"
                            placeholder=""
                            value={this.state.encryptionKey}/>
                        <FormControl.Feedback/>
                        <HelpBlock>random permutation of [a-z] </HelpBlock>
                    </FormGroup>
                    <Button type="submit" bsStyle="primary" onClick={this.onSubmit}>Encode</Button>

                </form>
                <hr/>
                <Grid className="encode-images-grid">
                    <Row>
                        <Col xs={6} md={6}>
                            <Thumbnail id="ItemPreview1" src={`data:image/png;base64,${btoa(this.state.imageBytes)}`}
                                   alt="before-encoding" rounded responcive>
                                <h3>Original Image</h3>
                                <p>the image before injecting the text: {this.state.plainText.substring(0,10)}</p>
                            </Thumbnail>
                        </Col>
                        <Col xs={6} md={6}>
                            <canvas id="banana"></canvas>
                            {/*<Thumbnail id="ItemPreview2" src={`data:image/png;base64,${btoa(this.state.imageBytesAfterEncoding)}`}*/}
                                   {/*alt="after-encoding" rounded responcive>*/}
                                {/*<h3>Injected Image</h3>*/}
                                {/*<p>Try to notice differences!</p>*/}
                            {/*</Thumbnail>*/}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}
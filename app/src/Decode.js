import React from "react";
import {Button, ControlLabel, FormControl, FormGroup, HelpBlock} from "react-bootstrap";

export class DecodeForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.setEncryptionKey = this.setEncryptionKey.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            encryptionKey: '',
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

    setEncryptionKey(e) {
        this.setState({encryptionKey: e.target.value});
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

    onSubmit(e) {
        e.preventDefault();
        this.setState({decodedMessage:"tom loves bananas"});
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
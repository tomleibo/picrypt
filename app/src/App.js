import React, {Component} from 'react';
import logo from './assets/logo.svg';
import original_vs_stego from "./assets/original_vs_stego_image.png";


import './App.css';
import {Jumbotron} from "react-bootstrap";

export const Header = () => (
    <div className="App">
        <header className="App-header">

            <h1 className="App-title">Welcome to pic-crypt</h1>
            <p className="App-intro">
                Encode messages in image.bmp files.
            </p>
        </header>
    </div>
);


class App extends Component {
    render() {
        return (
            <Jumbotron>
                <div className="flex-row">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2 >Steganography</h2>
                </div>
                <p>
                    Ancient greeks used to write a secret letter on the shaved head of the messenger, leaving hair to
                    grow then be sent to the recipient.
                    In 2018 an image file can hide secret data event better then a shaved head, using manipulation of
                    the file in a way that makes a new copy of the file injected with the secret message that looks the
                    same as the original to the human eye.
                    Image files are excellent for hiding data because of their large size.
                </p>
                < img className="main-image-original-vs-stego" alt="original-vs-stego" src={original_vs_stego}/>
            </Jumbotron>
        );
    }
}

export default App;

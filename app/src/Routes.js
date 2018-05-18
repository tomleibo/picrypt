import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App, {Header} from "./App";
import NavBar from "./NavBar";
import {EncodeForm} from "./Encode";
import {DecodeForm} from "./Decode";
import {Footer} from "./Footer";

export class Routes extends React.PureComponent {
    render(){
        return <Router>
            <div className="container">
                <NavBar/>
                <Header/>
                <Route exact path="/" component={App} />
                <Route exact path="/latest" component={App} />
                <Route path="/encode" component={EncodeForm} />
                <Route path="/decode" component={DecodeForm} />
                <Footer/>
            </div>
        </Router>
    }
}

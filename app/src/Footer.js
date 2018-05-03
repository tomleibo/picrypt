import React from "react";

export class Footer extends React.PureComponent {

    render() {
        return <footer className="page-footer font-small blue pt-4 mt-4">
            <div className="container-fluid text-center text-md-left">
                <div className="row">
                    <div className="col-md-6">
                        <h5 className="text-uppercase">stenography resources</h5>
                        <p>nice stuff here</p>
                    </div>
                    <div className="col-md-6">
                        <h5 className="text-uppercase">Links</h5>
                        <ul className="list-unstyled">
                            <li>
                                <a href="https://en.wikipedia.org/wiki/Steganographia">wikipedia</a>
                            </li>
                            <li>
                                <a href="http://www.garykessler.net/library/steganography.html">garykessler</a>
                            </li>
                            <li>
                                <a href="http://www.jjtc.com/Steganography/tools.html">tools</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-copyright py-3 text-center">
                © So Long, and Thanks for All the Fish
            </div>
        </footer>;
    }

}
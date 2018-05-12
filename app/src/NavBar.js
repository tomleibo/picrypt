import React from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';


class NavBar extends React.Component {
    render() {
        return (
            <Navbar  fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        <LinkContainer to="/">
                            <a >pic-crypt</a>
                        </LinkContainer>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="/encode">
                            <NavItem  eventKey={1} >Encode</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/decode">
                            <NavItem eventKey={2}>Decode</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <Navbar.Text pullRight>Keep calm and curry on</Navbar.Text>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

        );
    }
}

export default NavBar;
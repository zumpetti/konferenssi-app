import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { HashRouter, Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import './styles/App.css';

var strings;

export default class Header extends React.Component {
    constructor(props) {
        super(props);

        // tietojen siirto
        strings = this.props.palautus.tavara;
    }

    render() {

        const handleClick = e => this.props.palautus.muuttuja();

        return (
            <HashRouter>
                <div>
                    <Navbar fluid collapseOnSelect>
                        <Navbar.Header className="col-sm-3">
                            <Link to="/">
                                <Navbar.Brand className="navbar">
                                    <img src="firm_images/Logo.png" alt="TELELÄÄKETIETEEN SEURA" />
                                </Navbar.Brand>
                            </Link>
                            <Navbar.Toggle className="navbar" />
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav pullRight>
                                <LinkContainer to="/Schedule">
                                    <NavItem eventKey={1}>
                                        <p className="linkit">{strings.o1}</p>
                                    </NavItem>
                                </LinkContainer>
                                <LinkContainer to="/Speakers">
                                    <NavItem eventKey={2}>
                                        <p className="linkit">{strings.oa2}</p>
                                    </NavItem>
                                </LinkContainer>
                                <LinkContainer to="/Posters">
                                    <NavItem eventKey={3}>
                                        <p className="linkit">{strings.o2}</p>
                                    </NavItem>
                                </LinkContainer>
                                <LinkContainer to="/Info">
                                    <NavItem eventKey={4}>
                                        <p className="linkit">{strings.o3}</p>
                                    </NavItem>
                                </LinkContainer>
                                <NavItem onClick={handleClick}>
                                    {strings.o4} <img src={"firm_images/" + strings.kuva} alt={strings.kt} />
                                </NavItem>
                            </Nav>

                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </HashRouter >
        )
    }
}
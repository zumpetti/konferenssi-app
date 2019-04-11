import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Badge } from 'react-bootstrap';
import "./styles/Schedule.css";
import { Element, Link } from 'react-scroll';

var strings;

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.state = { per: [], lau: [], sessions: [], the_session: [] }

        // tietojen siirto
        strings = this.props.palautus.tavara;

        fetch('http://85.23.189.125:3002/schedule/get?date=1')
            .then(res => res.json())
            .then(per => (this.setState({ per })));

        fetch('http://85.23.189.125:3002/schedule/get?date=2')
            .then(res => res.json())
            .then(lau => (this.setState({ lau })));

        fetch('http://85.23.189.125:3002/sessions/get')
            .then(res => res.json())
            .then(sessions => (this.setState({ sessions })));


    }

    render() {

        const getSessionInfo = (sessio, get) => {

            if (this.state.sessions[sessio - 1] != null) {
                var text = this.state.sessions[sessio - 1];

                if (get === "tunnus") return text.tunnus
                if (get === "nimi") return text.nimi
                if (get === "paikka") return text.paikka
                if (get === "vetaja") return text.vetaja

                return (this.state.the_session);
            }
        }

        var lang = strings._language;

        var sessio = 0;

        let texts = {
            "otsikko": lang === "fi" ? "Ohjelma ja aikataulu" : "Schedule",
            "ykkospv": lang === "fi" ? "Tiistai 2.4.2019" : "Tuesday 2.4.2019",
            "kakkospv": lang === "fi" ? "Keskiviikko 3.4.2019" : "Wednesday 3.4.2019",
            "puhujana": lang === "fi" ? "Puhujana: " : "Speaker: ",
            "scrollto": lang === "fi" ? "Liu'uta keskiviikkoon" : "Scroll to Day 2"
        }

        return (
            <div>
                <h2>{texts.otsikko}</h2>
                <br />
                <ListGroup id="scheduLB">
                    <p id="scrollTo"><Link to="testi" smooth={true}>{texts.scrollto}</Link></p>
                    <ListGroupItem bsStyle="info" header={texts.ykkospv} id="top"></ListGroupItem>

                    <div>
                        {this.state.per.map(schedu => {

                            if (sessio < schedu.sessio) {
                                sessio = schedu.sessio;
                                return (
                                    <div key={"sessio_" + schedu.sessio}>
                                        <br />
                                        <Badge className="badge">
                                            <p>{'Session: ' + getSessionInfo(schedu.sessio, "tunnus")}</p>
                                            <p>{getSessionInfo(schedu.sessio, "nimi")}</p>
                                            <p>{getSessionInfo(schedu.sessio, "paikka")}</p>
                                            <span>{getSessionInfo(schedu.sessio, "vetaja")}</span>
                                        </Badge>
                                        <div>
                                            <div className="scheduleList" key={"id_" + schedu.id}>

                                                <ListGroupItem header={schedu.kellonaika}>
                                                    {schedu.nimi}
                                                    <br />
                                                    <b>{schedu.puhuja_nimi ? texts.puhujana + schedu.puhuja_nimi : null}</b>
                                                </ListGroupItem>
                                            </div>
                                        </div>
                                    </div>

                                );
                            }
                            else {
                                return (
                                    <div key={"id_" + schedu.id}>
                                        <div className="scheduleList">

                                            <ListGroupItem header={schedu.kellonaika}>
                                                {schedu.nimi}
                                                <br />
                                                <b>{schedu.puhuja_nimi ? texts.puhujana + schedu.puhuja_nimi : null}</b>
                                            </ListGroupItem>
                                        </div>
                                    </div>
                                );
                            }
                        })
                        }
                    </div>
                </ListGroup>
                <br />
                <Element name="testi">
                    <ListGroup id="scheduLB">

                        <ListGroupItem bsStyle="info" header={texts.kakkospv} id="top"></ListGroupItem>
                        <div>
                            {this.state.lau.map(schedu => {

                                if (sessio < schedu.sessio) {
                                    sessio = schedu.sessio;
                                    return (
                                        <div key={"sessio_" + schedu.sessio}>
                                            <br />
                                            <Badge id="badge">
                                                <p>{'Session: ' + getSessionInfo(schedu.sessio, "tunnus")}</p>
                                                <p> {getSessionInfo(schedu.sessio, "nimi")}</p>
                                                <p>{getSessionInfo(schedu.sessio, "paikka")}</p>
                                                <span>{getSessionInfo(schedu.sessio, "vetaja")}</span>
                                            </Badge>
                                            <div>
                                                <div className="scheduleList" key={"id_" + schedu.id}>

                                                    <ListGroupItem header={schedu.kellonaika}>
                                                        {schedu.nimi}
                                                        <br />
                                                        <b>{schedu.puhuja_nimi ? texts.puhujana + schedu.puhuja_nimi : null}</b>
                                                    </ListGroupItem>
                                                </div>
                                            </div>
                                        </div>

                                    );
                                }
                                else {
                                    return (
                                        <div key={"id_" + schedu.id}>
                                            <div className="scheduleList">

                                                <ListGroupItem header={schedu.kellonaika}>
                                                    {schedu.nimi}
                                                    <br />
                                                    <b>{schedu.puhuja_nimi ? texts.puhujana + schedu.puhuja_nimi : null}</b>
                                                </ListGroupItem>
                                            </div>
                                        </div>
                                    );
                                }
                            })
                            }
                        </div>
                    </ListGroup>
                </Element>
            </div>
        )
    }
}
import React, { Component } from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./styles/Posters.css";
var strings;

class Posters extends Component {

    constructor(props) {
        super(props);
        this.state = { posters: [] }

        strings = this.props.palautus.tavara;

        fetch('http://85.23.189.125:3002/posters/get')
            .then(res => res.json())
            .then(posters => (this.setState({ posters })));
    }

    render() {

        var lang = strings._language;

        var texts = {
            "otsikko": lang === "fi" ? "Posterit" : "Posters",
            "arv_link": lang === "fi" ? "Arvioinnit ja kommentit" : "Reviews and comments",
            "esittely": lang === "fi" ? "Esittelyteksti: " : "Introduction: "
        }

        return (
            <div>

                <h2>{texts.otsikko}</h2><br />
                {this.state.posters.map(poster =>
                    <div id="paapanel" key={poster.id}>
                        <Panel id="panelYla" bsStyle="primary">
                            <Panel.Heading>
                                <Panel.Title componentClass="h3">{poster.otsikko} <br /><br /> {poster.tekija}</Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>
                                <div id="posterInfo">
                                    <a download href={"./uploads/" + poster.pdf_file}>
                                        <img border="1" height="100" alt="" width="100" src="./firm_images/Adobe-PDF-Document-icon.png" />
                                    </a>
                                    <br />
                                    <p><b>{texts.esittely}</b></p>
                                    <p>{poster.kuvaus}</p>
                                </div>
                            </Panel.Body>
                            <Panel.Footer id="panelAla">
                                <div id="arv">
                                    <Glyphicon glyph="comment" />
                                    {" "}
                                    <Link to={{ pathname: "/Ratings/" + poster.id, state: poster.tekija }}>{texts.arv_link}</Link>
                                </div>
                            </Panel.Footer>
                        </Panel>
                    </div>
                )}
            </div>
        );
    }
}

export default Posters;

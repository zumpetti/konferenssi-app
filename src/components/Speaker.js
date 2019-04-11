import React from "react";
import { Image, Grid, Row, Col } from 'react-bootstrap';
import './styles/Speaker.css';
import UserImage from './user.svg';
import ShowMore from 'react-show-more';

const speaker = (props) => {
    return (
        <div>
            <Grid className='cont'>
                <Row>
                    <Col>
                        <Image className='profilePic' src={"./uploads/" + props.kuva_file} onError={(e) => { e.target.onerror = null; e.target.src = UserImage }} width="100" height="100" responsive circle />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3>{props.name}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p><b>
                            {props.lang === "fi" ? props.kuvaus_fi ? props.kuvaus_fi : props.kuvaus_en : props.kuvaus_en ? props.kuvaus_en : props.kuvaus_fi}
                        </b></p><br />
                        <p><strong>
                            {props.lang === "fi" ? "Esittelyteksti:" : "Introduction:"}
                        </strong></p>
                        <div id="text-part">
                            <ShowMore
                                lines={5}
                                more={props.lang === "fi" ? "Näytä lisää" : "Show more"}
                                less={props.lang === "fi" ? "Näytä vähemmän" : "Show less"} >
                                <p>{props.lang === "fi" && props.esittely_fi !== null ? props.esittely_fi : props.esittely_en}</p>
                            </ShowMore>
                        </div>
                    </Col>
                </Row>
            </Grid>
        </div>
    )
};

export default speaker;

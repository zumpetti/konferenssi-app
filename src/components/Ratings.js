import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import "./styles/Ratings.css";

class Ratings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ratings: [],
            newRating: [],
            posterinfo: null,
            tekija: "",
            otsikko: "",
            errortext: ""
        }

        fetch('http://193.167.78.138:3002/ratings/get?id=' + this.props.match.params.id)
            .then(res => res.json())
            .then(ratings => (this.setState({ ratings })));

        fetch('http://193.167.78.138:3002/posters/get?id=' + this.props.match.params.id)
            .then(res => res.json())
            .then(posterinfo => (this.setState({ posterinfo })))
            .then(() => this.setState({ otsikko: this.state.posterinfo[0].otsikko, tekija: this.state.posterinfo[0].tekija }));

    }

    getRatings = _ => {
        fetch('http://193.167.78.138:3002/ratings/get?id=' + this.props.match.params.id)
            .then(res => res.json())
            .then(ratings => (this.setState({ ratings })));

        setTimeout(() => {
            this.setState({});
        }, 10);
    }

    addRating = _ => {
        const { newRating } = this.state;
        if (typeof newRating.kommentoija === "undefined" || newRating.kommentoija === "") {
            setTimeout(() => {
                this.setState({ errortext: "Name is required!" });
            }, 10);
        }
        else if ((newRating.kommentti === "undefined" || newRating.kommentti === "") && (newRating.arvosana === "undefined")) {
            setTimeout(() => {
                this.setState({ errortext: "Leave a comment and/or rate the poster!" });
            }, 10);
        }
        else {
            const { newRating } = this.state;
            newRating.posteri_id = this.props.match.params.id;

            var url = "http://193.167.78.138:3002/ratings/add?posteri_id=" + newRating.posteri_id + "&kommentoija=" + newRating.kommentoija.replace("'", "`");
            if (newRating.kommentti !== undefined) url = url + "&kommentti=" + newRating.kommentti.replace("'", "`");
            if (newRating.arvosana !== undefined) url = url + "&arvosana=" + newRating.arvosana;
            fetch(url)
                .then(res => res.json())
                .then(this.getRatings);

            setTimeout(() => {
                this.setState({
                    newRating: [],
                    posterinfo: null,
                    tekija: "",
                    otsikko: "",
                    errortext: ""
                });
            }, 10)
        }
    }

    render() {

        const { newRating } = this.state;

        return (
            <div>
                <h2>Reviews</h2>
                <h3 style={{ margin: 'auto' }}>{this.state.otsikko ? this.state.otsikko : null}</h3>
                <h4>{this.state.tekija ? this.state.tekija : null}</h4>
                <br />
                <Link to="/Posters"><Button className="backBtn">Back to posters</Button></Link>
                <br /><br />

                {this.state.ratings.map(ratings =>

                    <div id="rating" key={ratings.id}>
                        <ListGroup>
                            <div id="ratingName">
                                <ListGroupItem id="ratingHead" header={"Arvostelija: " + ratings.kommentoija}>
                                    <span><b>Arvosana</b>: {ratings.arvosana ? ratings.arvosana : "Ei arvostelua"}</span><br />
                                    <span><b>Kommentti</b>: {ratings.kommentti}</span>
                                </ListGroupItem>
                            </div>
                        </ListGroup>
                    </div>

                )}
                <br />

                <ListGroup>
                    <div id="newRatingHead">
                        <ListGroupItem bsStyle="info" header="Add a review" />
                    </div>
                    <div id="newRatingMid">
                        <ListGroupItem>
                            <p>
                                <b>Your name (required): </b>
                                <br />
                                <input className="nameBox"
                                    value={newRating.kommentoija}
                                    onChange={e => this.setState({ newRating: { ...newRating, kommentoija: e.target.value } })}
                                />
                            </p><br />

                            <p>
                                <b>Comment: </b>
                                <br />
                                <textarea className="commentBox"
                                    value={newRating.kommentti}
                                    onChange={e => this.setState({ newRating: { ...newRating, kommentti: e.target.value } })}
                                />
                            </p>
                            <b>Ratings (1-5): </b><br />
                            <DropdownButton id="ratingDropdown" bsStyle="info"
                                title={this.state.newRating.arvosana ? this.state.newRating.arvosana : "Choose..."}>
                                <MenuItem onSelect={e => this.setState({ newRating: { ...newRating, arvosana: 1 } })}>1</MenuItem>
                                <MenuItem onSelect={e => this.setState({ newRating: { ...newRating, arvosana: 2 } })}>2</MenuItem>
                                <MenuItem onSelect={e => this.setState({ newRating: { ...newRating, arvosana: 3 } })}>3</MenuItem>
                                <MenuItem onSelect={e => this.setState({ newRating: { ...newRating, arvosana: 4 } })}>4</MenuItem>
                                <MenuItem onSelect={e => this.setState({ newRating: { ...newRating, arvosana: 5 } })}>5</MenuItem>
                            </DropdownButton>
                            <br />
                            <p id="error">{this.state.errortext}</p>
                            <p><button onClick={this.addRating}>Add a review</button></p>
                        </ListGroupItem>
                    </div>
                </ListGroup>
                <Link to="/Posters"><Button className="backBtn">Back to posters</Button></Link>
            </div >
        )
    }
}

export default Ratings;
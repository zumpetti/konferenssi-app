import React, { Component } from 'react';
import './styles/Speakers.css';
import Speaker from './Speaker'
import { Element, Link } from 'react-scroll';
var strings;

class Speakers extends Component {

  constructor(props) {
    super(props);

    this.state = { db_fetch_data: [] }

    strings = this.props.palautus.tavara;

  }

  async componentDidMount() {
    fetch('http://85.23.189.125:3002/speakers/get')
      .then(res => res.json())
      .then(db_fetch_data => (this.setState({ db_fetch_data })));


  }

  render() {
    var lang = strings._language;

    let texts = {
      "otsikko": lang === "fi" ? "Puhujat" : "Speakers",
      "tostart": lang === "fi" ? "Alkuun" : "Back to top"
    }

    return (
      <div>
        <h2><Element name="tostart">{texts.otsikko}</Element></h2><br />
        <div className="grid">
          {this.state.db_fetch_data.map(data => {
            return (
              <Speaker key={data.id} name={data.nimi} kuvaus_fi={data.kuvaus_fi} kuvaus_en={data.kuvaus_en} kuva_file={data.kuva_file} esittely_fi={data.esittely_fi} esittely_en={data.esittely_en} lang={lang} />
            )
          })}
        </div>

        <p><Link to="tostart">{texts.tostart}</Link></p>
      </div>
    );
  }
}

export default Speakers;

import './components/styles/App.css';
import React from 'react';
import Header from "./components/Header";
import { Route, HashRouter } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import Ratings from "./components/Ratings";
import Home from "./components/Home";
import Posters from "./components/Posters";
import Info from "./components/Info"
import Speakers from "./components/Speakers";
import Schedule from "./components/Schedule";
import DataManage from "./components/DataManage";
import DataImport from "./components/DataImport";

let strings;
let navigointi;
let props = {
	tavara: strings,
}

let props3;


class App extends React.Component {

	constructor(props) {
		super(props);

		// Tietojen lataukseen tarvittavat tilat
		this.state = {
			items: [],
			isLoaded: false,
		}
		this.muutaKieli = this.muutaKieli.bind(this);
	}

	muutaKieli() {
		// Käytetään localizedstrings omaa funktiota setLanguage('kieli')
		if (strings.getLanguage() === 'en') {
			strings.setLanguage('fi');
			navigointi.setLanguage('fi');
		}
		else {
			strings.setLanguage('en');
			navigointi.setLanguage('en');
		}
		this.setState({});
	};

	componentDidMount() {
		// Ladataan tiedot tämän kautta
		this._loadTexts();
	}

	_loadTexts() {
		// Kaikkien tekstien haku apista
		fetch(`http://85.23.189.125:3002/texts/get`)
			.then(result => result.json())
			.then(texts => this._enterTexts(texts.value))
			.then(texts => this.setState({ items: texts.value, isLoaded: true }));
	}

	_enterTexts(texts) {

		// Navigointipalkin tekstien alustus	
		navigointi = new LocalizedStrings({
			fi: {
				o1: "Ohjelma",
				o2: "Posterit",
				o3: "Kartta & Info",
				o4: "In English",
				oa1: "Aikataulu",
				oa2: "Puhujat",
				kuva: "en.png",
				kt: "en",
				btn: "In English"
			},
			en: {
				o1: "Schedule",
				o2: "Posters",
				o3: "Map & Info",
				o4: "Suomeksi",
				oa1: "Timetable",
				oa2: "Speakers",
				kuva: "fi.png",
				kt: "fi",
				btn: "Suomeksi"
			}
		});

		// Muitten tekstien alustus
		strings = new LocalizedStrings({
			fi: {
				o1: "Ohjelma",
				o2: "Posterit",
				o3: "Kartta & Info",
				o4: "In English",
				oa1: "Aikataulu",
				oa2: "Puhujat",
				kuva: "en.png",
				kt: "en",
				btn: "In English"
			}
		});

		// Tässä annetaan netistä haetut arvot
		strings.setContent(texts);


		return "oleellinen";

	}

	render() {

		// Tällä varmistetaan että kaikki on ladattu ennen näyttöä
		if (this.state.isLoaded === false) {
			return (
				<div>
					<h3>Ladataan sisältöä / Loading content</h3>
				</div>);
		}
		else {
			// Muut
			props = {
				tavara: strings,
			}
			// Navigointipalkkia varten
			props3 = {
				tavara: navigointi,
				muuttuja: this.muutaKieli,
			}

			return (
				<div className="App">
					<HashRouter>
						<div className="routing">
							<Header path="/Header" palautus={props3} />
							<Route exact path="/" render={() => <Home palautus={props} />} />
							<Route path="/Posters" render={() => <Posters palautus={props} />} />
							<Route path="/Ratings/:id" component={Ratings} />
							<Route key="Info" path="/Info" render={() => <Info palautus={props} />} />
							<Route path="/Speakers" render={() => <Speakers palautus={props} />} />
							<Route path="/Schedule" render={() => <Schedule palautus={props} />} />
							<Route path="/DataManage" component={DataManage} />
							<Route path="/DataImport" component={DataImport} />
						</div>
					</HashRouter>
				</div>
			);
		}
	}
}

export default App;
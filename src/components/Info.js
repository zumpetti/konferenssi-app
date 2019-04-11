import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import './styles/Info.css';
import { SocialIcon } from 'react-social-icons';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

var strings;
export default class Info extends Component {

	constructor(props) {
		super(props);

		strings = this.props.palautus.tavara;
		this.state = {
			info_blocks: []
		};

		fetch(`http://193.167.78.138:3002/info/get`)
			.then(res => res.json())
			.then(info_blocks => (this.setState({ info_blocks })));

	}

	/*

	paneelit() {
		// Tällä luodaan "automatisoidusti" paneeleita kartan alle, 
		// mutta whilen "4" täytyy vaihtaa tilanteen mukaan
		var i = 0;
		var rows = [];
		while (i < 4) {
			if (strings.info[i].tyyppi === 'paneeli') {
				var res = strings.info[i].teksti.split(" ");
				var res2 = strings.info[i + 1].teksti.split(" ");
				rows.push(<div className="tilaa">
					<Panel className="paneelit col-sm-6">
						<Panel.Heading><h3>{strings.info[i].otsikko}</h3></Panel.Heading>
						<Panel.Body><p>{res[0] + " " + res[1]}</p><p>{res[2] + " " + res[3] + " " + res[4] + " " + res[5]}</p><p>{res[6]}</p></Panel.Body>
					</Panel>
					<Panel className="paneelit col-sm-6">
						<Panel.Heading><h3>{strings.info[i].otsikko}</h3></Panel.Heading>
						<Panel.Body><p>{res2[0] + " " + res2[1]}</p><p>{res2[2] + " " + res2[3] + " " + res2[4] + " " + res2[5]}</p><p>{res2[6]}</p></Panel.Body>
					</Panel>
				</div>);
				i = i + 2;
			}
		}
		return (<div>{rows}</div>);
	}

	*/


	render() {
		let texts = {
			"kartta": strings._language === "fi" ? "Kartta" : "Map",
			"rakennus": strings._language === "fi" ? "Rakennuksen pohjakuva" : "Floor plan of the building",
			"download": strings._language === "fi" ? "(Lataa kuvatiedosto painamalla kuvasta)" : "(Download picture by clicking the image)",
			"somet": strings._language === "fi" ? "Sosiaaliset mediat" : "Social Media",
			"kysely": strings._language === "fi" ? "eHealth Etiikka 2019 -kysely" : "eHealth Ethics 2019 survey",
			"kysely_body": strings._language === "fi" ? "Tällä kyselyllä kartoitetaan eHealth 2019 konferenssiin osallistujien näkemyksiä sote-alan digitalisaatioon liittyvistä tulevaisuuden eettisistä kysymyksistä ja eettisestä osaamisesta. Kyselyn toteutaa Sote-Peda-hanke ja tuloksia hyödynnetään etiikan opetuksen kehittämisessä korkeakouluissa (www.sotepeda247.fi)" : "This purpose of this survey is to find out about the conference participants’ views on the future ethical issues and ethical competence related to the digitalisation in social and health care. This survey is implemented by the Sote-Peda project and the results will be used in the development of ethics education in higher education institutions.",
			"kysely_body_2": strings._language === "fi" ? "SotePeda 24/7 -hanke on Opetus- ja kulttuuriministeriön rahoittama hanke, joka aloitti toimintansa keväällä 2018 ja päättyy vuoden 2020 lopussa. Hankkeeseen osallistuu 24 suomalaista korkeakoulua (ammattikorkeakouluja ja yliopistoja) sekä laaja sote-alan yhteistyöverkosto." : "The SotePeda 24/7 project is a project funded by the Ministry of Education and Culture. The duration of the project is from spring 2018 till the end of year 2020. The total of 24 Finnish higher education institutions (universities and universities of applied sciences) are involved in the project as well as an extensive social and health care network.",
			"sotepeda_link": strings._language === "fi" ? "(pääset kyselyyn painamalla)" : "(enter the survey by clicking)"
		}

		var lang = strings._language;
		return (
			<div className="App">
				<h2>Info</h2><br />
				<div className="tilaa">
					<Panel>
						<Panel.Heading><h3>{texts.kartta}</h3></Panel.Heading>
						<Panel.Body><iframe title="gm" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.0454551221537!2d27.64670176487714!3d62.89695615685367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4684b081f6d91bd1%3A0x24dcaa262f0c85c7!2sKuopion+yliopistollinen+sairaala!5e0!3m2!1sfi!2sfi!4v1531811530484" width="100%" height="300" frameBorder="0" style={{ border: 0 }}></iframe></Panel.Body>
					</Panel>
				</div>

				<div className="tilaa">
					<Panel>
						<Panel.Heading><h3>{texts.rakennus}</h3>{texts.download}</Panel.Heading>
						<Panel.Body>
							<a download href="/firm_images/20190225-eHealth2019-exhibition.jpg">
								<img src="/firm_images/20190225-eHealth2019-exhibition.jpg" alt="pohjakuva" />
							</a>
						</Panel.Body>
					</Panel>
				</div>

				<div className="tilaa">
					<Panel className="paneelit col-sm-6">
						<Panel.Heading>
							<h3>{texts.somet}</h3>
						</Panel.Heading>
						<Panel.Body>
							<p className="some_feed">
								<TwitterTimelineEmbed className="some_feed"

									sourceType="profile"
									screenName="FSfTeHP"
									options={{ height: 300, border: '1px' }}
									style={{ border: '1px' }}
								/>
							</p>
							<p>
								<SocialIcon url="https://www.facebook.com/ehealthfinland" />
								<SocialIcon url="https://twitter.com/FSfTeHP" />
							</p>
						</Panel.Body>
					</Panel>
				</div>

				<div className="tilaa">
					<Panel className="paneelit col-sm-6">
						<Panel.Heading>
							<h3>{texts.kysely}</h3>
						</Panel.Heading>
						<Panel.Body>
							<p>{texts.kysely_body}</p>
							<p>{texts.kysely_body_2}</p>

							<p id="sotepeda-img">
								<a target="_blank" href={strings._language === "fi" ? "https://link.webropolsurveys.com/S/0FBE6989491CA86A" : "https://link.webropolsurveys.com/S/FEED1B63B0A0BB29"}>
									<img src={strings._language === "fi" ? "/firm_images/sotepeda_kysely_fi.jpg" : "/firm_images/sotepeda_kysely_en.jpg"} />
									<p id="sotepeda-font">{texts.sotepeda_link}</p>
								</a>
							</p>
						</Panel.Body>
					</Panel>
				</div>

				{this.state.info_blocks.map(info_blocks =>
					<div className="tilaa" key={info_blocks.id}>
						<Panel className="paneelit col-sm-6">
							<Panel.Heading><h3>{lang === "fi" ? info_blocks.rooli_fi : info_blocks.rooli_en}</h3></Panel.Heading>
							<Panel.Body>
								<p>{info_blocks.nimi}</p>
								<p>{info_blocks.puhnro}</p>
								<p>{info_blocks.email}</p>
							</Panel.Body>
						</Panel>
					</div>
				)
				}
			</div>
		)
	}
}
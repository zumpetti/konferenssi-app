import React from 'react';
import { Carousel, Jumbotron } from 'react-bootstrap';
import '../App.css';

var strings;

export default class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			images: [],
			carousel: []
		}

		strings = this.props.palautus.tavara;

		fetch(`http://85.23.189.125:3002/images/get?sivu=etusivu`)
			.then(res => res.json())
			.then(images => (this.setState({ images })))

	}

	render() {

		var lang = strings._language;
		let texts = {
			"jumbo": lang === "fi" ? "#eHealth2019 Kansainvälinen Konferenssi" : "#eHealth2019 International Conference",
			"jumbo_sub": lang === "fi" ? "2.-3. Huhtikuu 2019 | KYS | Kuopio" : "2-3 April 2019 | Kuopio University Hospital | Kuopio | Finland",
			"speakers": lang === "fi" ? "Puhujat" : "Speakers",
			"map": lang === "fi" ? "Kartta" : "Map & Info",
			"timetable": lang === "fi" ? "Ohjelma ja aikataulu" : "Timetable"
		}

		return (
			<div>
				<Jumbotron className="jumbotron text-center">
					<h1>{texts.jumbo}</h1>
					<p>
						{texts.jumbo_sub}
					</p>
				</Jumbotron>
				<Carousel className="carousel-container" style={{ padding: '0%' }}>
					{this.state.images.map(imgs => {
						return (
							<Carousel.Item key={"img_" + imgs.id}>
								<img id="carousel-img" alt={"img_" + imgs.id} src={"/uploads/" + imgs.file} />
							</Carousel.Item>
						)
					})}
				</Carousel>
			</div >
		)
	}
}
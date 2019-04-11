import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel, Table, Tab, Tabs } from "react-bootstrap";
import "./styles/DataManage.css";

export default class Manage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logged: 0,
            pincode: "",
            errortext: "",
            tab_key: "",
            puhuja: {
                nimi: "",
                kuvaus: "",
                kuva_file: "null"
            },
            posteri: {
                tekija: "",
                otsikko: "",
                kuvaus: "",
                pdf_file: ""
            },
            admin_menu: 0,
            posters: [],
            speakers: [],
            schedule_pe: [],
            schedule_la: [],
            selectedFile: null,
            selectedPdf: null
        };
    }

    validateForm() {
        return this.state.pincode.length > 0;
    }

    handleChange = event => {
        this.setState({
            pincode: event.target.value
        });
    }



    handleSubmit = () => {
        if (this.state.pincode === "1234") {
            setTimeout(() => {
                this.setState({ logged: 1, errortext: "" });
            }, 10);
        }

        else if (this.state.pincode === "1232") {
            setTimeout(() => {
                this.setState({ logged: 2, errortext: "" });
            }, 10);
        }

        else if (this.state.pincode === "2345") {
            setTimeout(() => {
                this.setState({ logged: 3, errortext: "" });
            }, 10);
        }

        else {
            setTimeout(() => {
                this.setState({ errortext: "Pin-koodi ei täsmää. Kokeile uudestaan!" });
            }, 10);
        }

        setTimeout(() => {
            this.setState({ pincode: "" });
        }, 10);
    }

    logout = _ => {
        setTimeout(() => {
            this.setState({
                logged: 0,
                pincode: "",
                errortext: "",
                tab_key: "",
                puhuja: {
                    nimi: "",
                    kuvaus: "",
                    kuva_file: "null"
                },
                posteri: {
                    tekija: "",
                    otsikko: "",
                    kuvaus: "",
                    pdf_file: ""
                },
                admin_menu: 0,
                posters: [],
                speakers: [],
                schedule_pe: [],
                schedule_la: [],
                selectedFile: null,
                selectedPdf: null
            });
        }, 10);
    }

    componentDidMount() {
        fetch('http://85.23.189.125:3002/posters/get')
            .then(res => res.json())
            .then(posters => (this.setState({ posters })));

        fetch('http://85.23.189.125:3002/speakers/get')
            .then(res => res.json())
            .then(speakers => (this.setState({ speakers })));

        fetch('http://85.23.189.125:3002/schedule/get?date=1')
            .then(res => res.json())
            .then(schedule_pe => (this.setState({ schedule_pe })));

        fetch('http://85.23.189.125:3002/schedule/get?date=2')
            .then(res => res.json())
            .then(schedule_la => (this.setState({ schedule_la })));
    }

    deletePoster = id => {
        fetch(`http://85.23.189.125:3002/posters/del?id=${id}`);
        this.componentDidMount();
    }

    render() {

        const handleselectedFile = event => {
            this.setState({ selectedFile: event.target.files[0] })
        }

        const addSpeaker = _ => {
            const { puhuja } = this.state;
            if (typeof puhuja.nimi === "undefined" || puhuja.nimi === "") {
                setTimeout(() => {
                    this.setState({ errortext: "Nimikenttä on pakollinen." });
                }, 10);
            }

            else if (typeof puhuja.kuvaus === "undefined" || puhuja.kuvaus === "") {
                setTimeout(() => {
                    this.setState({ errortext: "Kirjoita pieni kuvaus itsestäsi." })
                }, 10);
            }

            else {
                if (this.state.selectedFile != null) {
                    const data = new FormData();
                    data.append('file', this.state.selectedFile, this.state.selectedFile.name);
                    data.append('filename', puhuja.nimi.replace(" ", "_") + "_face")
                    puhuja.kuva_file = puhuja.nimi.replace(" ", "_") + "_face.jpg";
                    fetch('http://85.23.189.125:8000/upload', {
                        method: 'POST',
                        body: data,
                    });
                }

                setTimeout(() => {
                    this.setState({ logged: 0 });
                }, 10);
                fetch(`http://85.23.189.125:3002/speakers/add?nimi=${puhuja.nimi}&kuvaus=${puhuja.kuvaus}&kuva_file=${puhuja.kuva_file}`)

                setTimeout(() => {
                    this.setState({ errortext: "Sinut on lisätty onnistuneesti. Mukavaa tapahtumaa!" });
                }, 10);
            }
        }




        if (this.state.logged === 0) {
            return (
                <div className="Login">
                    <FormGroup controlId="pincode" bsSize="medium">
                        <ControlLabel>Anna pin-koodi:</ControlLabel>
                        <FormControl value={this.state.pincode} onChange={this.handleChange} type="pincode" />
                    </FormGroup>

                    <Button block bsSize="large" disabled={!this.validateForm()} onClick={this.handleSubmit} type="submit">
                        Kirjaudu sisään
                    </Button>

                    <br />
                    <p>{this.state.errortext}</p>
                </div>
            );
        }


        // Puhujan ilmoittautuminen

        else if (this.state.logged === 1) {
            const { puhuja } = this.state;
            return (
                <div>
                    <h3>Puhujan ilmoittautuminen</h3>
                    <div>
                        <p><b>Anna nimesi:</b></p>
                        <p><input value={puhuja.nimi} onChange={e => this.setState({ puhuja: { ...puhuja, nimi: e.target.value } })} type="textbox" className="nimiBox" /></p>

                        <p><b>Kirjoita lyhyt kuvaus itsestäsi:</b></p>
                        <p><input value={puhuja.kuvaus} onChange={e => this.setState({ puhuja: { ...puhuja, kuvaus: e.target.value } })} type="textbox" className="kuvausBox" /></p>

                        <p><b>Oma kuvasi (vaihtoehtoinen):</b></p>
                        <center><input type="file" accept="image/jpg" ref={(ref) => { this.uploadInput = ref; }} onChange={handleselectedFile} /></center>
                        <br />
                        <p><Button onClick={addSpeaker}>Lisää puhuja</Button>
                            <Button onClick={this.logout}>Kirjaudu ulos</Button></p>
                        <br />
                        <p><font color="red">{this.state.errortext}</font></p>
                    </div>
                </div>
            );
        }

        // ReadUpdateDelete-Hallinta
        else if (this.state.logged === 2) {

            return (
                <div id="">
                    <h3>Sisällön hallinta</h3>
                    <br />

                    <Tabs activeKey={this.state.tab_key} id="mainTabs" onSelect={tab_key => this.setState({ tab_key })}>

                        <Tab eventKey="posterit" title="Posterit">
                            <br />
                            <Table bordered responsive>
                                <thead>
                                    <tr>
                                        <th>Tekijän nimi</th>
                                        <th>Otsikko</th>
                                        <th>Kuvaus suomeksi</th>
                                        <th>Toimenpiteet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.posters.map(posters =>
                                        <tr>
                                            <td>{posters.tekija}</td>
                                            <td>{posters.otsikko}</td>
                                            <td>{posters.kuvaus}</td>
                                            <td><Button onClick={() => this.deletePoster(posters.id)}>Poista</Button></td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            <br />

                        </Tab>

                        <Tab eventKey="puhujat" title="Puhujat">
                            <br />
                            <Table bordered responsive>
                                <thead>
                                    <tr>
                                        <th><center>Puhujan nimi</center></th>
                                        <th><center>Esittelyteksti</center></th>
                                        <th><center>Toimenpiteet</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.speakers.map(speakers =>
                                        <tr>
                                            <td>{speakers.nimi}</td>
                                            <td>{speakers.kuvaus}</td>
                                            <td><Button onClick={() => this.deleteSpeaker(speakers.id)}>Poista</Button></td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            <br />
                            <Button onClick={this.logout}>Kirjaudu ulos</Button>
                        </Tab>

                        <Tab eventKey="ohjelma" title="Ohjelma ja aikataulu">
                            <br />
                            <h3>Perjantai</h3>
                            <Table bordered responsive>
                                <thead>
                                    <tr>
                                        <th><center>Ohjelmanumeron nimi</center></th>
                                        <th><center>Kellonaika</center></th>
                                        <th><center>Esittelyteksti</center></th>
                                        <th><center>Puhujana</center></th>
                                        <th><center>Toimenpiteet</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.schedule_pe.map(schedule_pe =>
                                        <tr>
                                            <td>{schedule_pe.nimi}</td>
                                            <td>{schedule_pe.kellonaika}</td>
                                            <td>{schedule_pe.kuvaus}</td>
                                            <td>{schedule_pe.puhuja_nimi}</td>
                                            <td><Button onClick={() => this.deleteSchedule(schedule_pe.id)}>Poista</Button></td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            <Button onClick={() => this.addSchedule("pe")}>Lisää tapahtuma perjantaille</Button>
                            <h3>Lauantai</h3>
                            <Table bordered responsive>
                                <thead>
                                    <tr>
                                        <th><center>Ohjelmanumeron nimi</center></th>
                                        <th><center>Kellonaika</center></th>
                                        <th><center>Esittelyteksti</center></th>
                                        <th><center>Puhujana</center></th>
                                        <th><center>Toimenpiteet</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.schedule_la.map(schedule_la =>
                                        <tr>
                                            <td>{schedule_la.nimi}</td>
                                            <td>{schedule_la.kellonaika}</td>
                                            <td>{schedule_la.kuvaus}</td>
                                            <td>{schedule_la.puhuja_nimi ? schedule_la.puhuja_nimi : <i>Ei merkittyä puhujaa</i>}</td>
                                            <td><Button onClick={() => this.deleteSchedule(schedule_la.id)}>Poista</Button></td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            <Button onClick={() => this.addSchedule("la")}>Lisää tapahtuma lauantaille</Button>
                            <br /><br />

                            <Button onClick={this.logout}>Kirjaudu ulos</Button>
                        </Tab>

                        <Tab eventKey="info" title="Info">

                        </Tab>
                    </Tabs>
                </div>
            );
        }
    }
}

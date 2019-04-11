import React from 'react';
import { Tabs, Tab, Button, FormGroup, ControlLabel, FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import './styles/DataImport.css';

export default class DataImport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            logged: 1,
            checked: 0,
            file_added: false,
            pw: "",
            errortxt: "",
            tab_key: "posterit",

            puhuja: [],
            etusivu: [],
            posteri: [],
            speakers_get: [],
            selectedFile: null,
            selectedPdf: null
        }

        fetch(`http://85.23.189.125:3002/speakers/get`)
            .then(res => res.json())
            .then(speakers_get => (this.setState({ speakers_get })));
    }

    validateForm() {
        return this.state.pw.length > 0;
    }

    login_handleChange = event => {
        this.setState({ pw: event.target.value });
        if (event.target.value === "teleL1") {
            this.setState({ logged: 1, pw: "" });
        }
    }

    handleselectedPdf = event => {
        this.setState({ selectedPdf: event.target.files[0] })
    }

    addSpeaker = () => {

        const { puhuja } = this.state;

        if ((puhuja.esittely_fi === null || puhuja.esittely_fi === "undefined") && (puhuja.esittely_en === null || puhuja.esittely_en === "undefined")) {
            setTimeout(() => {
                this.setState({ errortxt: "Esittely puuttuu, vähintään toisen kielen esittely on pakollinen!" });
            }, 10);
        }
        else {
            var url = "http://85.23.189.125:3002/speakers/update?id=" + puhuja.id;
            if (puhuja.esittely_fi !== "undefined") url = url + "&esittely_fi=" + puhuja.esittely_fi;
            if (puhuja.esittely_en !== "undefined") url = url + "&esittely_en=" + puhuja.esittely_en;

            console.log(url);
            fetch(url);

            setTimeout(() => {
                this.setState({ logged: 0, puhuja: [] });
            }, 10);
        }
    }

    addPoster = () => {
        const { posteri } = this.state;
        if (typeof posteri.tekija === "undefined" || posteri.tekija === "") {
            setTimeout(() => {
                this.setState({ errortext: "Nimikenttä on pakollinen." });
            }, 10)
        }
        else if (typeof posteri.otsikko === "undefined" || posteri.otsikko === "") {
            setTimeout(() => {
                this.setState({ errortext: "Posterin aihe/otsikko on pakollinen." });
            }, 10)
        }
        else if (typeof posteri.kuvaus === "undefined" || posteri.kuvaus === "") {
            setTimeout(() => {
                this.setState({ errortext: "Anna jonkinlainen lyhyt kuvaus posteristasi." });
            }, 10)
        }

        else if (posteri.kuvaus.length > 1200) {
            setTimeout(() => {
                this.setState({ errortext: "Maksimipituus on 1000 merkkiä." });
            }, 10)
        }

        else if (this.state.selectedPdf == null) {
            setTimeout(() => {
                this.setState({ errortext: "PDF-tiedosto puuttuu." });
            }, 10)
        }

        else {
            const pdfdata = new FormData();

            pdfdata.append('pdf', this.state.selectedPdf, this.state.selectedPdf.name);
            pdfdata.append('pdfname', this.state.selectedPdf.name);

            posteri.pdf_file = this.state.selectedPdf.name;

            fetch(`http://85.23.189.125:3002/posters/add?tekija=${posteri.tekija}&otsikko=${posteri.otsikko}&kuvaus=${posteri.kuvaus.replace("'", "`")}&pdf_file=${posteri.pdf_file}`)

            fetch('http://85.23.189.125:8000/upload_poster_pdf', {
                method: 'POST',
                body: pdfdata,
            });
            setTimeout(() => {
                this.setState({ posteri: [], selectedPdf: null, logged: 0 })
            }, 10)
        }
    }

    addEtusivuContent = () => {
        const { etusivu } = this.state;
        if (etusivu.text === undefined || etusivu.text === null) {
            setTimeout(() => {
                this.setState({ errortxt: "Yhteistyökumppanin nimi puuttuu!" });
            }, 10);
        }
        else if (this.state.selectedFile == null) {
            setTimeout(() => {
                this.setState({ errortxt: "Kuvatiedosto puuttuu!" });
            }, 10);
        }
        else {
            const data = new FormData();
            data.append('file', this.state.selectedFile, this.state.selectedFile.name);
            data.append('filename', this.state.selectedFile.name);
            etusivu.file = this.state.selectedFile.name;
            var url = "http://85.23.189.125:3002/images/add?sivu=etusivu&text=" + etusivu.text + "&file=" + this.state.etusivu.file;
            fetch(url);

            fetch('http://85.23.189.125:8000/upload_pic', {
                method: 'POST',
                body: data,
            });

            setTimeout(() => {
                this.setState({ logged: 0, etusivu: [], selectedFile: null });
            }, 10);
        }
    }


    logout = () => {
        setTimeout(() => {
            this.setState({ logged: 0, puhuja: [], etusivu: [], selectedFile: null, pw: "", errortxt: "" });
        }, 10);
    }

    setSpeakerValue(new_id, new_nimi) {
        setTimeout(() => {
            this.setState({ puhuja: { ...this.state.puhuja, id: new_id } });
        }, 10);
        setTimeout(() => {
            this.setState({ puhuja: { ...this.state.puhuja, nimi: new_nimi } });
        }, 10);
    }

    handleselectedFile = event => {
        this.setState({ selectedFile: event.target.files[0] })
    }

    changeChecked = () => {
        setTimeout(() => {
            this.setState({ checked: this.state.checked === 1 ? 0 : 1 });
        }, 10);

    }

    addPicture = () => {
        const { puhuja } = this.state;
        if (this.state.selectedFile != null) {
            const data = new FormData();
            data.append('file', this.state.selectedFile, this.state.selectedFile.name);
            data.append('filename', this.state.selectedFile.name);
            puhuja.kuva_file = this.state.selectedFile.name;
            fetch('http://85.23.189.125:8000/upload_pic', {
                method: 'POST',
                body: data,
            });

            fetch(`http://85.23.189.125:3002/speakers/upload?id=${puhuja.id}&kuva_file=${puhuja.kuva_file}`);

        }
        setTimeout(() => {
            this.setState({ file_added: true, selectedFile: null });
        }, 10);
    }

    handleTextChange = e => {
        const { etusivu } = this.state;
        this.setState({ etusivu: { ...etusivu, text: e.target.value } });
    }

    render() {

        const { posteri } = this.state;
        const { puhuja } = this.state;
        const { etusivu } = this.state;

        if (this.state.logged !== 0) {

            return (
                <div>
                    <h3>Data Import/Update</h3>
                    <div id="section">
                        <Tabs activeKey={this.state.tab_key} id="mainTabs" onSelect={tab_key => this.setState({ tab_key })}>
                            <Tab eventKey="etusivu" title="Etusivu">
                                <h4><p>Yhteistyökumppanin lisääminen</p></h4>
                                <div id="index_sec">
                                    <p><b>Yhteistyökumppanin nimi:</b></p>
                                    <p><input value={etusivu.text} type="text" onChange={this.handleTextChange} className="esittelyBox" /></p>

                                    <p><b>Lataa kuvatiedosto:</b></p>
                                    <p><input type="file" accept="image/jpg" ref={(ref) => { this.uploadInput = ref; }} onChange={this.handleselectedFile} /></p>
                                    <br />
                                    <p>
                                        <Button disabled={this.state.file_added} onClick={this.addEtusivuContent}>Lisää kuva</Button>
                                        <Button onClick={this.logout} style={{ margin: '1%' }}>Kirjaudu ulos</Button>
                                    </p>
                                </div>

                            </Tab>

                            <Tab eventKey="puhujatAdd" title="Puhujat - Add">
                                <h4><p>Puhujan lisäys</p></h4>

                            </Tab>

                            <Tab eventKey="puhujatUpdate" title="Puhujat - Update">
                                <h4><p>Puhujan tietojen päivitys</p></h4>
                                <div id="speakers_sec">

                                    <div>
                                        <p><b>Valitse puhuja:</b></p>
                                        <DropdownButton id="speakerDropdown" bsStyle="info" title={this.state.puhuja.nimi ? this.state.puhuja.nimi : "Valitse.."}>

                                            {this.state.speakers_get.map(speakers_get =>
                                                <MenuItem key={speakers_get.id} onSelect={() => this.setSpeakerValue(speakers_get.id, speakers_get.nimi)}>
                                                    {speakers_get.nimi}
                                                </MenuItem>
                                            )}
                                        </DropdownButton>
                                        <br />
                                        <p><b>Kuvaus suomeksi:</b></p>
                                        <p><input value={puhuja.esittely_fi} onChange={e => this.setState({ puhuja: { ...puhuja, esittely_fi: e.target.value } })} className="esittelyBox" /></p>

                                        <p><b>Kuvaus englanniksi:</b></p>
                                        <p><input value={puhuja.esittely_en} onChange={e => this.setState({ puhuja: { ...puhuja, esittely_en: e.target.value } })} className="enesittelyBox" /></p>

                                        <p>Kuvatiedosto <input type="checkbox" onChange={this.changeChecked} /></p>

                                        <div hidden={this.state.checked === 0 ? true : false}>
                                            <p><b>Lataa kuvatiedosto:</b></p>
                                            <p><input type="file" accept="image/jpg" ref={(ref) => { this.uploadInput = ref; }} onChange={this.handleselectedFile} /></p>
                                            <br />
                                            <p>
                                                <Button disabled={this.state.file_added} onClick={this.addPicture}>Lisää kuva</Button>
                                            </p>
                                        </div>
                                        <br />

                                        <Button onClick={this.addSpeaker}>Lisää puhuja</Button>
                                        <Button onClick={this.logout} style={{ margin: '1%' }}>Kirjaudu ulos</Button>

                                        <br />
                                        <p><font color="red">{this.state.errortxt}</font></p>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="posterit" title="Posterit">
                                <h4><p>Posterin lisäys</p></h4>
                                <div id="posters_sec">
                                    <p><b>Anna nimi:</b></p>
                                    <p><textarea value={posteri.nimi} onChange={e => this.setState({ posteri: { ...posteri, tekija: e.target.value } })} type="textbox" className="nimiBox" /></p>

                                    <p><b>Posterin otsikko/aihe:</b></p>
                                    <p><textarea value={posteri.otsikko} onChange={e => this.setState({ posteri: { ...posteri, otsikko: e.target.value } })} type="textbox" className="otsikkoBox" /></p>

                                    <p><b>Posterin esittelyteksti (max. 1200 merkkiä):</b></p>
                                    <p><textarea value={posteri.kuvaus} onChange={e => this.setState({ posteri: { ...posteri, kuvaus: e.target.value } })} type="textbox" className="kuvausBox" /></p>

                                    <p><b>Posterin pdf-tiedosto:</b></p>
                                    <center><input type="file" accept="application/pdf" ref={(ref) => { this.uploadInput = ref; }} onChange={this.handleselectedPdf} /></center>
                                    <br />
                                    <p><Button onClick={this.addPoster}>Lisää posteri</Button>
                                        <Button onClick={this.logout}>Kirjaudu ulos</Button></p>
                                    <br />
                                    <p><font color="red">{this.state.errortext}</font></p>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div id="login">
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Anna salasana:</ControlLabel>
                        <FormControl
                            type="password"
                            onChange={this.login_handleChange}
                            value={this.state.pw}
                        />
                    </FormGroup>

                    <br />{this.state.errortxt}
                </div>
            );
        }
    }
}

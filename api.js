const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3002;

var config = {
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'telelaak_konf_db'
}

var connection;

function handleDisconnect() {
	connection = mysql.createConnection(config);


	connection.connect(function (err) {
		if (err) {
			console.log('Error while connecting to database, reconnecting in 2 seconds:', err);
			setTimeout(handleDisconnect, 2000);
		}
	});

	connection.on('error', function (err) {
		console.log('db error', err);
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnect();
		}

		else {
			connection.connect(function (err) {
				if (err) {
					console.log('Error while connecting to database, reconnecting in 2 seconds:', err);
					setTimeout(handleDisconnect, 2000);
				}
			});
			throw err;
		}
	});
}

handleDisconnect();

connection.connect(err => {
	if (err)
		return err;
});

app.use(cors());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});



// POSTERS - API

app.get('/posters/add', (req, res) => {
	if (req.query.otsikko !== "undefined") var otsikko = req.query.otsikko;
	if (req.query.tekija !== "undefined") var tekija = req.query.tekija;
	if (req.query.kuvaus !== "undefined") var kuvaus = req.query.kuvaus;
	if (req.query.pdf_file !== "undefined") var pdf_file = req.query.pdf_file;

	if (!otsikko || !tekija || !kuvaus || !pdf_file) { return }
	else {
		var query = "INSERT INTO posterit (otsikko, tekija, kuvaus, pdf_file) values ('" + otsikko + "', '" + tekija + "', '" + kuvaus + "', '" + pdf_file + "')";
		connection.query(query, (err, results) => {
			if (err) {
				setTimeout(handleDisconnect(), 2000);
				throw err;
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
});

app.get('/posters/get', (req, res) => {
	var query = 'SELECT * FROM posterit';
	if (req.query.id) query = query + ' WHERE id=' + req.query.id;
	connection.query(query, (err, results) => {
		if (err) {
			handleDisconnect();
		}
		else {
			return res.send(results)
		}
		connection.end();
	});
});

app.get('/posters/del', (req, res) => {
	var id = req.query.id;
	var query = 'DELETE FROM posterit WHERE id=' + id;
	connection.query(query, (err, results) => {
		if (err) {
			return res.send(err)
		}
		else {
			return res.send(results)
		}
		connection.end();
	});
});



// PUHUJAT - API
app.get('/speakers/add', (req, res) => {
	var nimi = req.query.nimi;
	var kuvaus = req.query.kuvaus;
	if (req.query.kuva_file != null) { var kuva_file = req.query.kuva_file; }
	else var kuva_file = "null";

	if (!nimi) return
	else {
		var query = "INSERT INTO puhujat (nimi, kuvaus, kuva_file) values ('" + nimi + "', '" + kuvaus + "', '" + kuva_file + "')";
		connection.query(query, (err, results) => {
			if (err) {
				return res.send(err)
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
});

app.get('/speakers/get', (req, res) => {
	var query = "SELECT * FROM puhujat";
	connection.query(query, (err, results) => {
		if (err) {
			return res.send(err)
		}
		else {
			return res.send(results)
		}
		connection.end();
	});
});

app.get('/speakers/del', (req, res) => {
	var id = req.query.id;
	var query = 'DELETE FROM puhujat WHERE id=' + id;
	connection.query(query, (err, results) => {
		if (err) {
			return res.send(err)
		}
		else {
			return res.send(results)
		}
		connection.end();
	});
});

app.get('/speakers/update', (req, res) => {
	var id = req.query.id;
	var esittely_fi = req.query.esittely_fi;
	var esittely_en = req.query.esittely_en;

	if (!id || (!esittely_fi && !esittely_en)) return
	else {
		var query = "UPDATE puhujat SET esittely_fi = '" + esittely_fi + "', esittely_en = '" + esittely_en + "' WHERE id=" + id;
		connection.query(query, (err, results) => {
			if (err) {
				return res.send(err)
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
});

app.get('/speakers/upload', (req, res) => {
	var id = req.query.id;
	var kuva_file = req.query.kuva_file;

	if (!id || !kuva_file) return
	else {
		var query = "UPDATE puhujat SET kuva_file = '" + kuva_file + "' WHERE id=" + id;
		connection.query(query, (err, results) => {
			if (err) {
				return res.send(err)
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
});



// AIKATAULU - API

app.get('/schedule/get', (req, res) => {
	var query = "";
	if (req.query.id) {
		var id = req.query.id;
		var query = 'SELECT a.id, a.nimi, TIME_FORMAT(a.kellonaika, "%H:%i") as kellonaika, a.viikonpv, a.sessio_id as sessio, b.nimi as puhuja_nimi FROM ohjelma as a LEFT JOIN puhujat as b ON a.puhuja_id = b.id WHERE id = ' + id + ' ORDER BY viikonpv, kellonaika';
	}

	else if (req.query.date) {
		var date = req.query.date;
		if (req.query.date == "1") {
			var query = 'SELECT a.id, a.nimi, TIME_FORMAT(a.kellonaika, "%H:%i") as kellonaika, a.viikonpv, a.sessio_id as sessio, b.nimi as puhuja_nimi FROM ohjelma as a LEFT JOIN puhujat as b ON a.puhuja_id = b.id WHERE viikonpv = 1 ORDER BY sessio, kellonaika';
		}
		else if (req.query.date == "2") {
			var query = 'SELECT a.id, a.nimi, TIME_FORMAT(a.kellonaika, "%H:%i") as kellonaika, a.viikonpv, a.sessio_id as sessio, b.nimi as puhuja_nimi FROM ohjelma as a LEFT JOIN puhujat as b ON a.puhuja_id = b.id WHERE viikonpv = 2 ORDER BY sessio, kellonaika';
		}
	}

	else {
		query = 'SELECT a.nimi, TIME_FORMAT(a.kellonaika, "%H:%i") as kellonaika, a.viikonpv, a.sessio_id as sessio, b.nimi as puhuja_nimi FROM ohjelma as a LEFT JOIN puhujat as b ON a.puhuja_id = b.id ORDER BY viikonpv, sessio, kellonaika';
	}

	connection.query(query, (err, results) => {
		if (err) {
			return res.send(err)
		}
		else {
			return res.send(results)
		}
		connection.end();
	});

});

app.get('/schedule/del', (req, res) => {
	var id = req.query.id;
	if (!id) return
	else {
		var query = 'DELETE FROM ohjelma WHERE id=' + id;
		connection.query(query, (err, results) => {
			if (err) {
				return res.send(err)
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
});



// SESSIOT - API

app.get('/sessions/get', (req, res) => {
	var query = "SELECT * FROM sessiot";
	connection.query(query, (err, results) => {
		if (err) {
			return res.send(err)
		}
		else {
			return res.send(results)
		}
		connection.end();
	});
});



// ARVOSTELUT (POSTERI) - API

app.get('/ratings/get', (req, res) => {
	if (req.query.id) {
		var id = req.query.id;
		connection.query('SELECT * FROM posteri_kommentit WHERE posteri_id = ' + id, (err, results) => {
			if (err) {
				return res.send(err)
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
	else {
		connection.query('SELECT * FROM posteri_kommentit', (err, results) => {
			if (err) {
				return res.send(err)
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
});

app.get('/ratings/add', (req, res) => {
	var posteri_id = req.query.posteri_id;
	var kommentoija = req.query.kommentoija;
	var kommentti = req.query.kommentti;
	var arvosana = req.query.arvosana;

	if (!posteri_id || !kommentoija) return
	else if (!kommentti && !arvosana) return

	else {
		if (!kommentti) var query = "INSERT INTO posteri_kommentit (posteri_id, kommentoija, arvosana) values (" + posteri_id + ",'" + kommentoija + "'," + arvosana + ")";
		else if (!arvosana) var query = "INSERT INTO posteri_kommentit (posteri_id, kommentoija, kommentti) values (" + posteri_id + ",'" + kommentoija + "','" + kommentti + "')";
		else var query = "INSERT INTO posteri_kommentit (posteri_id, kommentoija, kommentti, arvosana) values (" + posteri_id + ",'" + kommentoija + "','" + kommentti + "'," + arvosana + ")";

		connection.query(query, (err, results) => {
			if (err) {
				return res.send(err)
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
});



// INFO-PALIKAT - API

app.get('/info/get', (req, res) => {
	if (req.query.id) {
		var id = req.query.id;
		connection.query('SELECT * FROM info_blocks WHERE id = ' + id, (err, results) => {
			if (err) {
				return res.send(err)
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
	else {
		connection.query('SELECT * FROM info_blocks', (err, results) => {
			if (err) {
				return res.send(err)
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
});



// IMAGES - API

app.get('/images/get', (req, res) => {
	if (req.query.sivu) { var query = "SELECT * FROM firm_images WHERE sivu = '" + req.query.sivu + "'"; }
	else { var query = "SELECT * FROM firm_images"; }
	connection.query(query, (err, results) => {
		if (err) {
			return res.send(err)
		}
		else {
			return res.send(results)
		}
		connection.end();
	});
});

app.get('/images/add', (req, res) => {
	if (req.query.sivu && req.query.file && req.query.text) {
		var sivu = req.query.sivu;
		var file = req.query.file;
		var text = req.query.text;
		var query = "INSERT INTO firm_images (sivu, text, file) values ('" + sivu + "', '" + text + "', '" + file + "')";

		connection.query(query, (err, results) => {
			if (err) {
				return res.send(err)
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
});



//TESTI !!!! POISTA !!!!

app.get('/test/get', (req, res) => {
	var query = "SELECT * FROM test";
	connection.query(query, (err, results) => {
		if (err) {
			return res.send(err)
		}
		else {
			return res.send(results)
		}
		connection.end();
	});
});

app.get('/test/add', (req, res) => {
	if (req.query.test) {
		var test = req.query.test;
		var query = "INSERT INTO test (test) values ('" + test + "')";
		connection.query(query, (err, results) => {
			if (err) {
				return res.send(err)
			}
			else {
				return res.send(results)
			}
			connection.end();
		});
	}
});


// TEKSTIT - API

app.get('/texts/get', (req, res) => {
	connection.query('SELECT * FROM tekstit', (err, results) => {
		if (err) {
			res.send(err)
		}
		else {
			var enkkut = JSON.parse('{"en":{"etusivu":{}, "info":{}, "posters":{}, "schedule":{}}, "fi":{"etusivu":{}, "info":{}, "posters":{}, "schedule":{}}}');
			var u = 0, u2 = 0, u3 = 0, u4 = 0, uPostfi = 0, uPosten = 0, uSchefi = 0, uScheen = 0;
			for (var i = 0; i < results.length; i++) {
				if (results[i].kieli === 'en') {
					if (results[i].sivu === 'etusivu') {
						enkkut.en.etusivu[u4] = results[i];
						u4++;

					}
					if (results[i].sivu === 'info') {
						enkkut.en.info[u3] = results[i];
						u3++;
					}

					if (results[i].sivu === 'posters') {
						enkkut.en.posters[uPosten] = results[i];
						uPosten++;
					}

					if (results[i].sivu === 'schedule') {
						enkkut.en.schedule[uScheen] = results[i];
						uScheen++;
					}

				}
				else {
					if (results[i].sivu === "etusivu") {
						enkkut.fi.etusivu[u] = results[i];
						u++;
					}
					if (results[i].sivu === "info") {
						enkkut.fi.info[u2] = results[i];
						u2++;
					}

					if (results[i].sivu === 'posters') {
						enkkut.fi.posters[uPostfi] = results[i];
						uPostfi++;
					}

					if (results[i].sivu === 'schedule') {
						enkkut.fi.schedule[uSchefi] = results[i];
						uSchefi++;
					}

				}

			}
			res.send({ type: "success", "value": enkkut });
		}
	});
});


app.listen(port, () => {
	console.log("Listening on port: " + port)
});
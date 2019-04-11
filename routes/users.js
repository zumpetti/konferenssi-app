var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.locals.connection.query('SELECT * FROM tekstit', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
			var enkkut = JSON.parse('{"en":{"etusivu":{}, "info":{}}, "fi":{"etusivu":{}, "info":{}}}');
			//var lol = JSON.parse('{ "en": {"o2":"Sentra", "doors":4, "koko": "2kpl"}}');
  			var u = 0, u2 = 0, u3 = 0, u4 = 0;
			for (var i = 0; i < results.length; i++) {
				if ( results[i].kieli === 'en') {
					if (results[i].sivu === 'etusivu') {
						enkkut.en.etusivu[u4] = results[i];
						u4++;
						 
					}
					if (results[i].sivu === 'info') {
						enkkut.en.info[u3] = results[i];
						u3++;
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
					
				}
				
			}
			res.send({type: "success", "value": enkkut});
  			//If there is no error, all is good and response is 200OK.
			//res.json(results);
		}
	});
});

module.exports = router;

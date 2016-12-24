var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

module.exports = {
    setscores: function(){
	var url = 'mongodb://localhost:27017/bgsquiz';
	MongoClient.connect(url, function (err, db){
	    if (err)throw err;
	    console.log("Connected correctly to server");
	    db.collection('Scores').update(
		{score: { $gt : 0 }}, // query
		{$set: {score: 0}}, // replacement, replaces only the field "hi"
		{multi: true, upsert: false}, // options
		function(err, object) {
		    if (err){console.warn(err.message); }
		    else{ console.dir(object); }
		}
	    );
	});
    }
}
	

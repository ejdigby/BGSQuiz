var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

module.exports = {
    raffle: function(room){
	var url = 'mongodb://localhost:27017/bgsquiz';
	MongoClient.connect(url, function (err, db){
	    if (err)throw err;
	    db.collection('Teams').find({"room" : room}, {teamname: 1, _id: 0}).toArray(function(err, doc){
		if (doc.length == 0){
		    raffleroom = room
		    rafflewinner = "There are no teams in the ";
		} else {
		    var rafflelist = [];
		    for (x = 0; x < doc.length; x++){
			rafflelist.push(doc[x].teamname);
		    }
		    var number = Math.floor((Math.random() * rafflelist.length))
		    rafflewinner = rafflelist[number];
		    raffleroom = " - " + room 
		}
	    });	
	    db.close()
	});
    }
}

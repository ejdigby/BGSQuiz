var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;


module.exports = {
    grabscore: function(teamname, room, round, res){
	var url = 'mongodb://localhost:27017/bgsquiz';
	MongoClient.connect(url, function (err, db){
	    if (err)throw err;
	    db.collection('Teams').find({"room" : room, "teamname" : teamname}).toArray(function (err, doc){
		if (doc.length != 0) {
		    if (round == "r1"){
			console.log(doc[0].r1)
			if (doc[0].r1 != 0){
			    res.end("no-score")
			    return;
			} else {
			    return;
			}
		    } else if (round == "r2"){
			console.log(doc[0].r2)
			if (doc[0].r2 != 0){
			    res.end("no-score")
			    return;
			} else {
			    return;
			}
		    } else if (round == "r3"){
			console.log(doc[0].r3)
			if (doc[0].r3 != 0){
			    res.end("no-score") 
			    return;
			} else {
			    return;
			}
		    } else if (round == "r4"){
			console.log(doc[0].r4)
			if (doc[0].r4 != 0){
			    res.end("no-score") 
			    return;
			} else {
			    return
			}
		    } else if (round == "r5"){
			console.log(doc[0].r5)
			if (doc[0].r5 != 0){
			    res.end("no-score") 
			    return;
			} else {
			    return;
			}
		    } else if (round == "r6"){
			console.log(doc[0].r6)
			if (doc[0].r6 != 0){
			    res.end("no-score") 
			    return;
			} else {
			    return;
			}
		    }
		}
	    });
	});
	}
			   }
	

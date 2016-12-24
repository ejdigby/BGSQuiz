var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

module.exports = {
    addscore: function(teamname, score, house, room, round, csrf, res){
	var url = 'mongodb://localhost:27017/bgsquiz';
	MongoClient.connect(url, function (err, db){
	    if (err)throw err;
	    if (csrf == privatetoken){
		teamname = teamname.trim(); 
		db.collection('Teams').find({"teamname" : teamname}).toArray(function(err, doc){
		    if (doc.length == 0){
			db.collection('Teams',{safe:true}, function(err, collection) {    
		        if (round == "r1"){
			    collection.insert({
				"teamname" : teamname,
				"house" : house, 
				"room" : room,
				"r1" : score, 
				"r2" : 0,
				"r3" : 0,
				"r4" : 0,
				"r5" : 0,
				"r6" : 0
			    }, function(err, doc) {
				if(err) { res.end("no"); }
                                else { res.end("yes"); }
			    });
			} else if (round == "r2"){
			    collection.insert({
				"teamname" : teamname,
				"house" : house, 
				"room" : room,
                                "r1" : 0,
                                "r2" : score,
                                "r3" : 0,
                                "r4" : 0,
                                "r5" : 0,
                                "r6" : 0
			    }, function(err, doc) {
				if(err){ res.end("no");}
				else { res.end("yes");}
			    });
			} else if (round == "r3"){
			    collection.insert({
				"teamname" : teamname,
				"house" : house, 
				"room" : room,
				"r1" : 0,
				"r2" : 0,
				"r3" : score,
				"r4" : 0,
				"r5" : 0,
				"r6" : 0
			    }, function(err, doc) {
				if(err){ res.end("no");}
				else{ res.end("yes");}
			    });
			} else if (round == "r4"){
			    collection.insert({
				"teamname" : teamname,
				"house" : house, 
				"room" : room,
				"r1" : 0,
				"r2" : 0,
				"r3" : 0,
				"r4" : 4,
				"r5" : 0,
				"r6" : 0
			}, function(err, doc) {
			    if(err){ res.end("no"); }
			    else{ res.end("yes"); }
			});
			} else if (round == "r5"){
			    collection.insert({
				"teamname" : teamname,
			     "house" : house, 
				"room" : room,
				"r1" : 0,
				"r2" : 0,
				"r3" : 0,
				"r4" : 0,
				"r5" : score,
				"r6" : 0
			}, function(err, doc) {
			    if(err){ res.end("no"); }
			    else{ res.end("yes"); }
			});
			} else if (round == "r6"){
			    collection.insert({
				"teamname" : teamname,
				"house" : house, 
				"room" : room,
				"r1" : 0,
				"r2" : 0,
				"r3" : 0,
				"r4" : 0,
				"r5" : 0,
				"r6" : score
			    }, function(err, doc) {
				if(err){ res.end("no"); }
			    else{ res.end("yes"); }
			    });
			}
		    });
		} else {
		    var userupdated = "null";
		    // !!!!!!!!!!
		    grabscore(teamname, room, round, res)
		    if (round == "r1"){
			var dbscore = parseInt(doc[0].r1);
			var newscore = dbscore + score;

			collection.update({"teamname" : teamname, "house" : house, "room" : room}
					  ,{$set:{"r1" : newscore}},
					  function(err, updated) {
					      if( err || !updated ) res.end("no-exists");
					      else res.end("yes");
					  }); 

		    } else if (round == "r2"){
			var dbscore = parseInt(doc[0].r2);
			var newscore = dbscore + score;

			collection.update({"teamname" : teamname, "house" : house, "room" : room}
					  ,{$set:{"r2" : newscore}},
					  function(err, updated) {
					      if( err || !updated ) res.end("no-exists");
					      else res.end("yes");
					  });			

		    } else if (round == "r3"){
			var dbscore = parseInt(doc[0].r3);
			var newscore = dbscore + score;

			collection.update({"teamname" : teamname, "house" : house, "room" : room}
					  ,{$set:{"r3" : newscore}},
					  function(err, updated) {
					      if( err || !updated ) res.end("no-exists");
					      else res.end("yes");
					  });			

		    } else if (round == "r4"){
			var dbscore = parseInt(doc[0].r4);
			var newscore = dbscore + score;

			collection.update({"teamname" : teamname, "house" : house, "room" : room}
					  ,{$set:{"r4": newscore}},
					  function(err, updated) {
					      if( err || !updated ) res.end("no-exists");
					      else res.end("yes");
					  });			

		    } else if (round == "r5"){
			var dbscore = parseInt(doc[0].r4);
			var newscore = dbscore + score;

			collection.update({"teamname" : teamname, "house" : house, "room" : room}
					  ,{$set:{"r5" : newscore}},
					  function(err, updated) {
					      if( err || !updated ) res.end("no-exists");
					      else res.end("yes");
					  });			

		    } else if (round == "r6"){
			var dbscore = parseInt(doc[0].r6);
			var newscore = dbscore + score;
			
			collection.update({"teamname" : teamname, "house" : house, "room" : room}
					  ,{$set:{"r6" : newscore}},
					  function(err, updated) {
					      if( err || !updated ) res.end("no-exists");
					      else res.end("yes");
					  });
		    }
		}		
	    });
	}else {
	    console.log("Token is wrong")
	    res.redirect("http://google.com");
	}
	
    });
}
}

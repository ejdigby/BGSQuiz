var MongoClient = require('mongodb').MongoClient;
var teamlist  = [];

module.exports = {
    grabteams: function(){
	var url = 'mongodb://localhost:27017/bgsquiz';
	MongoClient.connect(url, function (err, db){
	    if (err)throw err;
	    db.collection('Teams').find({}, {teamname: 1, _id: 0}).toArray(function(err, doc){
		for (x = 0; x < doc.length; x++){
		    teamlist.push(doc[x].teamname);
		} 
	    });	
	});
	return teamlist;
    }
}

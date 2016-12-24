var express = require('express');
var app = express()
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var port = 84;
var exphbs  = require('express-handlebars');
var config = require('./config.json');
var privatetoken = config.token;

var teamlist = [];
var rafflewinner = "";
var raffleroom = "";
var list = [];
var roomround={
    "Main_Hall":[1],
    "Sports_Hall":[2],
    "Drama_Studio":[3]
};

var url = 'mongodb://localhost:27017/bgsquiz';
MongoClient.connect(url, function (err, db){
if (err)throw err;
console.log("Connected correctly to server");
db.collection('Scores').update(
    {score: { $gt : 0 }}, // query
    {$set: {score: 0}}, // replacement, replaces only the field "hi"
    {multi: true, upsert: false}, // options
    function(err, object) {
	if (err){
	    console.warn(err.message);  // returns error if no matching object found
	}else{
	    console.dir(object);
	}
    }
);

io.sockets.on('StaffConnection', function(socket){
    console.log("NEW STAFF USER");
    
    socket.on("Hello", function (){
	console.log("Hello");
	});
});
io.sockets.on('connection', function (socket) {
    console.log("NEW USER")
    
    socket.on('RoundChange', function(data){
	console.log("Round Change")
	changeround(data.room, data.round)
    });

    socket.on('disconnect', function () {
	console.log("USER DISCONECTED")
    });
    socket.on('TeamSelected', function (data){
	console.log(data.teamname);
	db.collection('Teams').find({teamname : data.teamname}).toArray(function(Err, doc){
	    if (doc.length != 0){
		console.log("Teams autocomplete");
		socket.emit("TeamAutoComplete", {'datafound' : true, 'house' : doc[0].house, 'room' : doc[0].room, 'teamname':doc[0].teamname});
	    } else{
		socket.emit("TeamAutoComplete", {'datafound' : false})
}
	    });
    });
    socket.on('StaffConnection', function(){
	console.log("NEW STAFF USER");
});
    
socket.on('list', function (){
    var list;
    db.collection("Teams").find().toArray(function(err, doc){
	socket.emit("Listarray", {'doc' : doc});
    });

});

    var checkscore = function(num){

	var leaderboard = [];
	var leaderboardscores = [];
	db.collection('Teams').find().toArray(function(err, doc){
	    leaderboard = [];
	    for (x = 0; x < doc.length; x++){
		leaderboard.push(doc[x]);
	    }
	    io.sockets.emit('LeaderboardUpdate', {'LeaderBoard' :leaderboard, 'LeaderBoardScores' : leaderboardscores, 'roomround' : roomround});
	});
	var scorescollection = db.collection('Scores');
	var teamscollection = db.collection('Teams')

        var housenames = ['Behn' , 'Meitner' , 'Rorschach' , 'Tinbergen'];
        var housescores = [Behn , Meitner, Rorschach, Tinbergen];

        var housename = housenames[num];
	var housescore = housescores[num];
		
        scorescollection.find({"name":housename}, {score: 1, _id: 0}).toArray(function(err, doc) {
	    if (doc.length != 0){
		var dbscore = doc[0].score;
		var  oldhousescore = dbscore;
		if (dbscore != housescore){
		    housescore = dbscore;
		}
	    } 			
	    teamscollection.find({"house":housename}, {}).toArray(function(err, doc){
		var newhousescore = 0;
		if (doc.length != 0){          
		    for (x = 0; x < doc.length; x++){
			var newscore = 0

			 newhousescore = newhousescore + doc[x].r1 + doc[x].r2 + doc[x].r3 + doc[x].r4 + doc[x].r5 + doc[x].r6;
		    }
		    if (newhousescore == housescore){
			return
		    } else{
			io.sockets.emit('ScoreUpdate', {'House' : housename, 'Score' : newhousescore, "NumOfTeams" : doc.length});
			
			if (housename == 'Rorschach'){
			    Rorschach = Math.round(newhousescore / doc.length);
			}else if (housename == 'Meitner'){
			    Meitner = Math.round(newhousescore / doc.length);
			} else if (housename == 'Behn'){
			    Behn = Math.round(newhousescore / doc.length);
			} else if (housename == 'Tinbergen'){
			    Tinbergen = Math.round(newhousescore / doc.length);
			}

			scorescollection.findAndModify(
			    {name: housename}, // query
			    [],  // sort order
			    {$set: {score: newhousescore}}, // replacement, replaces only the field "hi"
			    {upsert: true}, // options
			    function(err, object) {
				if (err){
				    console.warn(err.message);  // returns error if no matching object found
				}else{
				    console.dir(object);
				}
			    }
			);
		    }}
	    });
	});
    }
    var i = -1;
    setInterval(function(){
	i++;  
	if (i > 3){
	    i = 0;
	} 
	checkscore(i);
    },500); 
});

var routes = require('./routes.js')(app, hbs);

});


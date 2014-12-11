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
var list = [];
var roomround={
    "Main_Hall":[1],
    "Sports_Hall":[2],
    "Drama_Studio":[3]
};
console.log(roomround.Main_Hall[0])
// Define Scores
var Rorschach = 0;
var Behn = 0;
var Meitner = 0;
var Tinbergen = 0;

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

module.exports = {
    

 grabteams: function(){
  db.collection('Teams').find({}, {teamname: 1, _id: 0}).toArray(function(err, doc){
      teamlist = [];
      for (x = 0; x < doc.length; x++){
	  teamlist.push(doc[x].teamname);
	} 
  });	
},



 raffle: function(room){
    db.collection('Teams').find({"room" : room}, {teamname: 1, _id: 0}).toArray(function(err, doc){
	if (doc.length == 0){
	    rafflewinner = "There Are No Teams In The " + room;
	 } else {
	     var rafflelist = [];
	     for (x = 0; x < doc.length; x++){
		 rafflelist.push(doc[x].teamname);
	     }
	     var number = Math.floor((Math.random() * rafflelist.length) + 1)
	     rafflewinner = rafflelist[number];
	 }
  });	

},
 addscore: function(teamname, score, house, room, round, csrf, res){
    var collection = db.collection('Teams');

     if (csrf == privatetoken){
	    teamname = teamname.trim(); 
	    collection.find({"teamname" : teamname}).toArray(function(err, doc){
		if (doc.length == 0){
	            db.collection('Teams',{safe:true}, function(err, collection) {    
		        collection.insert({
		            "teamname" : teamname,
			    ("r" + round) : score, 
			    "house" : house, 
			    "room" : room
			}, function(err, doc) {
			    if(err){
				console.log("Error on document insert"); 
				res.end("no");
			    } else{
				console.log("Document saved succesfuly"); 
				res.end("yes");
			    }
			});
		    });
		} else {
	            var dbscore = parseInt(doc[0].score);
	            var newscore = dbscore + score;
		    var userupdated = "null";

	            collection.update({"teamname" : teamname, "house" : house, "room" : room}
				      ,{$set:{"score" : newscore}},
				      function(err, updated) {
					  if( err || !updated ) {
					      console.log("User not updated");
					      res.end("no");
					  }else{
					      console.log("User updated");
					      userupdated = true;
					      res.end("yes");
					  }
				      });
		}		
	    });
    }else {
	console.log("Token Is Wrong")
	res.redirect("http://google.com");
    }

}
}


var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        Rorschach: function () { return Rorschach; },
        Behn: function () { return Behn; },
        Meitner: function () { return Meitner; },
        Tinbergen: function () { return Tinbergen; },
	Team: function() { return teamlist },
	Token: function() { return privatetoken },
	Raffle:function() { return rafflewinner },
	list:function() { return list }
   }
});


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use('/components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser()); // Automatically parses form data

    
app.use(express.static('views'));

server.listen(port);
console.log("Listening at port %s", port)

io.sockets.on('StaffConnection', function(socket){
    console.log("NEW STAFF USER");
    
    socket.on("Hello", function (){
	console.log("Hello");
	});
});
io.sockets.on('connection', function (socket) {
    console.log("NEW USER")
    socket.on('disconnect', function () {
	console.log("USER DISCONECTED")
    });
    socket.on('TeamSelected', function (data){
	console.log(data.teamname);
	db.collection('Teams').find({teamname : data.teamname}).toArray(function(Err, doc){
	    if (doc.length != 0){
		console.log("Teams Auto Comeplete");

		socket.emit("TeamAutoComplete", {'house' : doc[0].house, 'room' : doc[0].room, 'teamname':doc[0].teamname});
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
			
			io.sockets.emit('ScoreUpdate', {'House' : housename, 'Score' : newhousescore});
			
			if (housename == 'Rorschach'){
			    Rorschach = newhousescore;
			}else if (housename == 'Meitner'){
			    Meitner = newhousescore;
			} else if (housename == 'Behn'){
			    Behn = newhousescore;
			} else if (housename == 'Tinbergen'){
			    Tinbergen = newhousescore;
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
    },100); 
});

var routes = require('./routes.js')(app, hbs);

});


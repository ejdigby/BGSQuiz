var express = require('express');
var app = express()
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var port = 84;
var exphbs  = require('express-handlebars');
var privatetoken = "KWbqcWL57s";
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



var teamlist = [];

  db.collection('Teams').find({}, {teamname: 1, _id: 0}).toArray(function(err, doc){
	for (x = 0; x < doc.length; x++){
	  teamlist.push(doc[x].teamname);
	}
  });	
console.log(teamlist)
//teamlist = ['Team 1', 'Team 2', 'Team 3'];

// scorescollection.find({"name":housename}, {score: 1, _id: 0}).toArray(function(err, doc) {

var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        Rorschach: function () { return Rorschach; },
        Behn: function () { return Behn; },
        Meitner: function () { return Meitner; },
        Tinbergen: function () { return Tinbergen; },
	Team: function() { return teamlist },
	Token: function() { return privatetoken },
	}});


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser()); // Automatically parses form data

app.get('/', function (req, res, next) {
    console.log("Request for /");
    res.render('index', {
        showTitle: true,
    });
});

app.get('/staff', function(req, res){
    console.log("Request for /staff");
    res.render('staff/index', {
        showTitle: true,
    });
});

app.get('/raffle', function(req, res){
    console.log("Request for /raffle");
    res.render('raffle/index', {
        showTitle: true,
    });
});


app.post('/staffinput', function (req, res){
    console.log("Request for /staffinput");
    var teamname = req.body.teamname;
    var score = parseInt(req.body.score);
    var house = req.body.house;
    var room = req.body.room;
    var csrf = req.body._csrf;

    console.log(req.body.teamname)
    console.log(score)
    console.log(house)
    console.log(room)
    console.log(csrf);
    var collection = db.collection('Teams');
    if (csrf == privatetoken){

    teamname = teamname.trim(); 
    collection.find({"teamname" : teamname}).toArray(function(err, doc){
	if (doc.length == 0){
        db.collection('Teams',{safe:true}, function(err, collection) {    
	        collection.insert({
		            "teamname" : teamname,
		            "score" : score, 
		            "house" : house, 
		            "room" : room
		    }, function(err, doc) {
			        if(err){ console.log("Error on document insert"); }
			        else{ console.log("Document saved succesfuly"); }
			    });
	    });
	    } else {
        var dbscore = parseInt(doc[0].score);
        var newscore = dbscore + score;

        collection.update({"teamname" : teamname, "house" : house, "room" : room}
            ,{$set:{"score" : newscore}},
			  function(err, updated) {
			      if( err || !updated ) console.log("User not updated");
			      else console.log("User updated");
			      });
		res.send('<script>window.location.href = "http://quiz.ejdigby.com/staff"</script>');
    }
	});
}else {
    console.log("Token Is Wrong")
}
});

app.use(express.static('views'));

server.listen(port);
console.log("Listening at port %s", port)


io.sockets.on('connection', function (socket) {

    console.log("NEW USER")

  socket.on('disconnect', function () {
      console.log("USER DISCONECTED")
  });

   
    var checkscore = function(num){


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
				
	    
			teamscollection.find({"house":housename}, { house: 1,  score: 1, _id: 0}).toArray(function(err, doc){
		    var newhousescore = 0;
			    if (doc.length != 0){          
						for (x = 0; x < doc.length; x++){
						    newhousescore = newhousescore + doc[x].score;
						
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

});				}
 	var i = -1;
	setInterval(function(){
		i++;  
		if (i > 3){
		i = 0;
		} 
		checkscore(i);
	},100); 
});
});

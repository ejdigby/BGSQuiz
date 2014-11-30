var express = require('express');
var app = express()
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var port = 84;
var exphbs  = require('express-handlebars');

// Define Scores
var Rorschach = 5;
var Behn = 0;
var Meitner = 0;
var Tinbergen = 0;

var url = 'mongodb://localhost:27017/bgsquiz';
MongoClient.connect(url, function (err, db){
if (err)throw err;
console.log("Connected correctly to server");

var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        Rorschach: function () { return Rorschach; },
        Behn: function () { return Behn; },
        Meitner: function () { return Meitner; },
        Tinbergen: function () { return Tinbergen; },
 }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.json()); // Automatically parses form data

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


app.get('/staffinput', function (req, res){
    console.log("Request for /staffinput");
    var teamname = req.query['teamname'];
    var score = parseInt(req.query['score']);
    var house = req.query['house'];
    var room = req.query['room'];
   
    var collection = db.collection('Teams');
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
			      });
		res.send('<script>window.location.href = "http://quiz.ejdigby.com/staff"</script>');
    }
	});
});

app.use(express.static('views'));

server.listen(port);
console.log("Listening at port %s", port)

io.sockets.on('connection', function (socket) {
    console.log("NEW USER")
    var scorescollection = db.collection('Scores');
	var teamcsollection = db.collection('Teams');
   
   var checkscore = function(num){
        var housenames = ['Behn' , 'Meitner' , 'Rorschach' , 'Tinbergen'];
        var housescores = [Behn , Meitner, Rorschach, Tinbergen];

        var housename = housenames[num];
		var housescore = housescores[num];

        scorescollection.find({"name":housename}, {score: 1, _id: 0}).toArray(function(err, doc) {
            if (doc.length != 0){
                var dbscore = doc[0].score;
			    if (dbscore != housescore){
					housescore = dbscore;
				}     
			}
	    });

	    teamscollection.find({"house":housename}, { house: 1,  score: 1, _id: 0}).toArray(function(err, doc){
			if (doc.length != 0){
	 			for (x = 0; x < doc.lengthitem; x++){
					if (doc[x].house  == "Rorschach"){
				        Rorschach = Rorschach + docs[x].score;
				        housescore = Rorschach;
				    } else if (doc[x].house == "Meitner"){
						Meitner = Meitner + doc[x].score;
						housescore = Meitner
					} else if (doc[x].house == "Tinbergan"){
		                Tinbergan = Tinbergan + doc[x].score;
		                housescore = Tinbergan
				    } else if (doc[x].house == "Behn"){ 
			            Behn = Behn + doc[x].score;
			            housescore = Behn;
					}
				}
			}
		
		
		scorescollection.findAndModify(
		    {"house": housename}, // query
		    {$set: {"score": housescore}}, // replacement, replaces only the field "hi"
		    {}, // optionas
		    function(err, object) {
				if (err){
				    console.warn(err.message);  // returns error if no matching object found
				}else{
					console.dir(object);
				}
		});
            socket.emit('ScoreUpdate', {'House' : housename, 'Score' : housescore});
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
});

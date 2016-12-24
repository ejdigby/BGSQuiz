var roundfile = require('./lib/rounds.js')
console.log(roundfile.roomround.Main_Hall);
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var exphbs = require('express-handlebars');
var port = 84

var io = require('socket.io').listen(server);

var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;


//Files
var roundfile = require('./lib/rounds.js')
var setscorefile = require('./lib/setscores.js');
var config = require('./lib/config.json');
var privatetoken = config.token;
var grabteams = require('./lib/grabteams.js');
// Define Scores
var Rorschach = 0;
var Behn = 0;
var Meitner = 0;
var Tinbergen = 0;

setscorefile.setscores()
grabteams.grabteams()
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
	RaffleRoom:function() { return raffleroom },
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

var routes = require('./lib/routes.js')(app, hbs);

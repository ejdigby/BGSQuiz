//Import Files
var config = require('./config.json');
var serverfile = require('../server.js');
var grabteamsfile = require('./grabteams.js');

module.exports = function(app, hbs){
    app.get('/', function (req, res, next) {
	console.log("Request for /");
	res.render('index', {
            showTitle: true,
	});
    });

app.get('/staff', function(req, res){
    console.log("Request for /staff");
    if (!req.query.token){
	console.log("Request for /staff rejected")
	res.redirect("/login")
	return;
    }
    if (req.query.token == config.logintoken || req.query.token == config.adminlogintoken){
	console.log("Request for /staff accepted");
	res.render('staff/index', {
	    showTitle: true,
	    helpers: {
		Team: function () { return grabteamsfile.grabteams(); }
	    }
	});
    } else {
	console.log("Request for /staff rejected")
	res.redirect("/login")
	return;
    }
});
    app.get('/list', function(req, res){
	if (!req.query.token){
	    console.log("Request for /list rejected")
	    res.redirect("/login")
	    return;
	}
	if (req.query.token == config.logintoken){
	    console.log("Request for /list")
	    res.render('staff/list/index', {
		showTitle: true,
	    });
	} else {
            console.log("Request for /list rejected")
            res.redirect("/login")
            return;
    }
	
    });
    app.get('/raffle', function(req, res){
	console.log("Request for /raffle");
	res.render('staff/raffle/index', {
            showTitle: true,
	});
    });
    app.post('/raffle', function(req, res){
	console.log("Post request for /raffle");
	serverfile.raffle(req.body.room)
	res.redirect('/raffle')
    });
    app.get('/login', function(req, res){
	console.log("Request for /login");
        console.log("FROM :" + req.query.from)
	if (req.query.from){
	    from = req.query.from
	}
	res.render('login/index', {
	    showTitle: true,
	});
    });
    app.post('/login', function(req, res){
	console.log("Post request for /login");
	var password = req.body.password
	var csrf = req.body._csrf;
	
	if (csrf == config.token){
	    console.log("Token Is Correct!")
	    if (password == config.password){
		console.log("Password is correct!");
		res.redirect("/staff?token=" + config.logintoken);
		return;
	    }else {
		console.log("Password is wrong!");
		res.redirect("/login");
	    }
	} else {
	    console.log("Token is wrong");
	    res.redirect("http://google.com");
	}
    });
    
    
    
    app.post('/staff', function (req, res){
	console.log("Post request for /staff");
	var teamname = req.body.teamname;
	var score = parseInt(req.body.score);
	var house = req.body.house;
	var room = req.body.room;
	var round = req.body.round;
	var csrf = req.body._csrf;
	serverfile.addscore(teamname, score, house, room, round, csrf, res);
	
    });
    
    
}

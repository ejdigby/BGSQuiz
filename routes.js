var config = require('./config.json');
var serverfile = require('./server.js');

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
   if (req.query.token == config.logintoken){
       serverfile.grabteams();
       console.log("Request for /staff accepted");
       res.render('staff/index', {
	   showTitle: true,
       });
    } else {
	console.log("Request for /staff rejected")
	res.redirect("/login")
	return;
    }
});
app.get('/list', function(req, res){
    console.log("Request for /list")
    res.render('staff/list/index', {
	showTitle: true,
    });
});
app.get('/raffle', function(req, res){
    console.log("Request for /raffle");
    res.render('staff/raffle/index', {
        showTitle: true,
    });
});
app.post('/raffle', function(req, res){
    console.log("Post request for /raffle");
    rafflewinner = "";
    serverfile.raffle(req.body.room)
    res.redirect('/raffle')
});
app.get('/round', function(req, res){
    console.log("Request for /round")
    res.render('staff/round/index', {
	showTitle: true,
    });
});
app.post('/round', function(req, res){
    console.log("Post request for /round");
    serverfile.changeround(req.body._csrf, req.body.room, res)
});

app.get('/login', function(req, res){
    console.log("Request for /login");
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
	} else {
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

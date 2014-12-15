var config = require('./config.json');
var serverfile = require('./server.js');
var from;
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
   if (!req.query.token){
       console.log("Request for /list rejected")
       res.redirect("/login?from=/list")
       return;
   }
   if (req.query.token == config.adminlogintoken){
       console.log("Request for /list")
       res.render('staff/list/index', {
	   showTitle: true,
       });

    } else {
        console.log("Request for /list rejected")
        res.redirect("/login?from=/list")
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
app.get('/round', function(req, res){
    if (!req.query.token){
       console.log("Request for /round rejected")
       res.redirect("/login?from=/round")
       return;
   }
   if (req.query.token == config.logintoken){
       console.log("Request for /round")
       res.render('staff/round/index', {
	   showTitle: true,
       });
    } else {
        console.log("Request for /round rejected")
        res.redirect("/login?from=/round")
        return;
    }


});
app.post('/round', function(req, res){
    console.log("Post request for /round");
    serverfile.changeround(req.body._csrf, req.body.room, res)
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
   console.log(from)
    if (csrf == config.token){
	console.log("Token Is Correct!")
	if (password == config.password){
	    console.log("Password is correct!");
	    if (from){
		console.log("FROM IS DEFINED");
		console.log(from + "?token=" + config.logintoken);
		res.redirect(from + "?token=" + config.logintoken);
		return;
	    } else {
		res.redirect("/staff?token=" + config.logintoken);
		return;
	    }
	}else if (password == config.adminpassword){
	    console.log("Developer Password Used!")
	    if (from){
		console.log("FROM IS DEFINED");
		console.log(from + "?token=" + config.adminlogintoken);
		res.redirect(from + "?token=" + config.adminlogintoken);
		return;
	    } else {
		res.redirect("/staff?token=" + config.adminlogintoken);
		return;
	    }
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

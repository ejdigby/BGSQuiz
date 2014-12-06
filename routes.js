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
       res.redirect("http://quiz.ejdigby.com/login")
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
	res.redirect("http://quiz.ejdigby.com/login")
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
    rafflewinner = "";
    serverfile.raffle(req.body.room)
    res.redirect('/raffle')
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

    if (csrf == serverfile.privatetoken){
	console.log("Token Is Correct!")
	if (password == config.password){
	    console.log("Password is correct!");
	    res.redirect("http://quiz.ejdigby.com/staff?token=" + config.logintoken);
	    return;
	} else {
	    console.log("Password is wrong!");
	    res.redirect("http://quiz.ejdigby.com/login");
	}
} else {
    console.log("Token is wrong");
}
});


}

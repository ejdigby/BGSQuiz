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


}

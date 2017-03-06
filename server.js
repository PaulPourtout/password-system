// BASE SETUP
//================================================
// CALL PACKAGES

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var User = require('./app/models/user');

// Connect to our database
mongoose.connect('mongodb://localhost:27017/test_db');
// APP CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Config our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
});

// Log all requests to the console
app.use(morgan('dev'));

// ROUTES FOR OUR API
//===============================================

// basics route for the home PACKAGES
app.get('.', function(res, req) {
    res.send('Welcome to the home again');
});

// get an instance of the express router
var apiRouter = express.Router();
// test route to make sure everything is working

//
apiRouter.use(function(req, res, next) {
    // do logging
    console.log("Il y a quelqu'un sur mon api");
    next();
});

// access to GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
    res.json({message: 'Yeah Baby !!!!!!'});
});

app.use('/api', apiRouter);

apiRouter.route('/users').post(function(req, res) {
    var user = new User();

    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err) {
        if (err) {
            if (err.code == 11000)
                return res.json({success: false, message: "L'utilisateur existe déjà"});
            else
                return res.send(err);
            }
        res.json({message: "L'utilisateur est dans la place"});
    });

}).get(function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);

        // Return the users
        res.json(users);
    });
});

// GET on :USER_ID
apiRouter.route('/users/:user_id')
	.get(function(req, res) {
    	User.findById(req.params.user_id, function(err, user) {
        if (err)
            res.send(err);

        // return that user
        res.json(user);
    	});
	})
	.put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (req.body.name)
                user.name = req.body.name;
            if (req.body.username)
                user.username = req.body.username;
            if (req.body.password)
                user.password = req.body.password;

            //Save the user
            user.save(function(err) {
                if (err)
                    return res.send(err);

                // return a message
                res.json({message: "utilisateur est mis à jour"});
            });
        });
    })
	.delete(function(req, res) {
		User.remove({
			_id:req.params.users_id
		}, function(err, user) {
			if(err) return res.send(err);
			res.json({message: 'Supprimer avec succes'});
		});
	});


// START THE SERVER
//==================================================
app.listen(port);
console.log('C\' est parti mon kiki !');

/**
 * Created by Vincent on 10/12/2016.
 */

//Load packages
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('./config');
var app = express();

//Load models
var Movie = require('./models/movie')
var User = require('./models/user')
var Rating = require('./models/rating')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('secret', config.secret);

//Define port
var port = config.port;

var router = express.Router();

//Connect to notflix database
mongoose.connect(config.database);

//Test the connection to the database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to notflix database');
});

//Test the router
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

//Code for /authenticate
//-------------------------------------------------------------------------------------------------------------
router.route('/authenticate')
    .post(function(req, res) {

        // find the user
        User.findOne({
            username: req.body.username
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token
                    var payload = {
                        username: user.username,
                    };

                    var token = jwt.sign(payload, app.get('secret'), {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    //console.log(jwt.decode(token))

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
    });

//Code for /movies
//-------------------------------------------------------------------------------------------------------------
router.route('/movies')

    //Get all movies http://localhost:8080/api/movies
    .get(function(req, res) {
        Movie.find(function(err, movies) {
            if (err)
                res.send(err);
            res.json(movies);
        });
    });

router.route('/movies/:imdb_number')

    //Get the movie with a specific imdb id http://localhost:8080/api/movies/:imdb_number
    .get(function(req, res) {
        Movie.find({'imdb_number':req.params.imdb_number}, function(err, movie) {
            if (err)
                res.send(err);
            res.json(movie);
        });
    });

router.route('/movieswithrating') //Not finished yet

//Get the movie with a specific imdb id http://localhost:8080/api/movies/:imdb_number
    .get(function(req, res) {
        Movie.find(function(err, movies) {
            if (err)
                res.send(err);
            Rating.find({}, '', function(err, ratings) {
                if (err)
                    res.send(err);
                res.json(ratings);
            });
            res.json(movies);
        });
    });

//Code for /users
//-------------------------------------------------------------------------------------------------------------
router.route('/users')

//Create a user with POST http://localhost:8080/api/users)
    .post(function(req, res) {

        var user = new User();
        user.last_name = req.body.last_name;
        user.surname_prefix = req.body.surname_prefix;
        user.first_name = req.body.first_name;
        user.username = req.body.username;
        user.password = req.body.password;

    //Save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
    });

//Router middleware: you have to sign in to access everything beneath here
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('secret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.route('/users')

//Get all users http://localhost:8080/api/users
    .get(function(req, res) {
        User.find({}, 'first_name surname_prefix last_name username ', function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

router.route('/users/:user_id')

//Get the user with a specific id http://localhost:8080/api/movies/:user_id
    .get(function(req, res) {
        User.findById(req.params.user_id, 'first_name surname_prefix last_name username ', function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    });

//Code for /ratings
//-------------------------------------------------------------------------------------------------------------
router.route('/ratings')

//Create a rating with POST http://localhost:8080/api/ratings)
    .post(function(req, res) {

        var score = req.body.rating;

        if(score >= 1 && score <= 10){ //Rating from 1 to 10, 1 = 0.5 stars, 10 = 5 stars
            var rating = new Rating();
            rating.imdb_number = req.body.imdb_number;
            rating.rating = req.body.rating;
            rating.by_user = req.body.by_user;

            //Save the user and check for errors
            rating.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Rating created!' });
            });
        } else {
            res.json({ message: 'The score should be between 1 and 10 inclusive' });
        }
    })

    //Get all ratings http://localhost:8080/api/ratings
    .get(function(req, res) {

        var current_user = req.decoded.username;

        Rating.find({'by_user':current_user},function(err, ratings) {
            if (err)
                res.send(err);
            res.json(ratings);
        });
    });

router.route('/ratings/:rating_id')

//Get the user with a specific id http://localhost:8080/api/ratings/:rating_id
    .get(function(req, res) {

        var current_user = req.decoded.username;

        Rating.findById(req.params.rating_id, function(err, rating) {
            if(rating.by_user == current_user) {
                if (err)
                    res.send(err);
                res.json(rating);
            } else {
                res.json({ message: 'You do not have the neccesary permissions to view this rating! :(' });
            }
        });
    })

    //Update the rating http://localhost:8080/api/ratings/:rating_id)
    .put(function(req, res) {

        var current_user = req.decoded.username;

        Rating.findById(req.params.rating_id, function(err, user) {
            if(rating.by_user == current_user) {
                if (err)
                    res.send(err);

                rating.imdb_number = req.body.imdb_number;
                rating.rating = req.body.rating;
                rating.by_user = req.body.by_user;

                // save the rating
                user.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Rating updated!' });
                });
            } else {
                res.json({ message: 'You do not have the neccesary permissions to modify this rating! :(' });
            }
        });
    })

    //Delete the rating http://localhost:8080/api/ratings/:rating_id)
    .delete(function(req, res) {
        if(rating.by_user == current_user) {
            Rating.remove({
                _id: req.params.rating_id
            }, function(err, rating) {
                if (err)
                    res.send(err);

                res.json({ message: 'Rating deleted!' });
            });
        } else {
            res.json({ message: 'You do not have the neccesary permissions to delete this rating! :(' });
        }
    });


//Register the routes
app.use('/api', router);

//Start the server
app.listen(port);
console.log('listening on port 8080')
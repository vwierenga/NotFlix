/**
 * Created by Vincent on 10/12/2016.
 */

//Load packages
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Load models
var Movie = require('./models/movie')
var User = require('./models/user')
var Rating = require('./models/rating')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Define port
var port = 8080;

var router = express.Router();

//Connect to notflix database
mongoose.connect('mongodb://localhost/notflix');

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
        Movie.findById(req.params.imdb_number, function(err, movie) {
            if (err)
                res.send(err);
            res.json(movie);
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
    })

//Get all users http://localhost:8080/api/users
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

router.route('/users/:user_id')

//Get the user with a specific id http://localhost:8080/api/movies/:user_id
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    });

//Code for /ratings NOG NIET AF!
//-------------------------------------------------------------------------------------------------------------
router.route('/ratings')

//Create a user with POST http://localhost:8080/api/ratings)
    .post(function(req, res) {

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
    })

    //Get all ratings http://localhost:8080/api/ratings
    .get(function(req, res) {
        Rating.find(function(err, ratings) {
            if (err)
                res.send(err);
            res.json(ratings);
        });
    });

router.route('/ratings/:rating_id')

//Get the user with a specific id http://localhost:8080/api/ratings/:rating_id
    .get(function(req, res) {
        Rating.findById(req.params.rating_id, function(err, rating) {
            if (err)
                res.send(err);
            res.json(rating);
        });
    })

    //Update the rating http://localhost:8080/api/ratings/:rating_id)
    .put(function(req, res) {

        Rating.findById(req.params.rating_id, function(err, user) {

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

        });
    })

    //Delete the rating http://localhost:8080/api/ratings/:rating_id)
    .delete(function(req, res) {
        Rating.remove({
            _id: req.params.rating_id
        }, function(err, rating) {
            if (err)
                res.send(err);

            res.json({ message: 'Rating deleted!' });
        });
    });


//Register the routes
app.use('/api', router);

//Start the server
app.listen(port);
console.log('listening on port 8080')
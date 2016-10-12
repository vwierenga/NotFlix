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

router.route('/movies/:movie_id')

    //Get the movie with a specific imdb id http://localhost:8080/api/movies/:movie_id
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

// create a user with POST http://localhost:8080/api/bears)
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

//Get all movies http://localhost:8080/api/movies
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

router.route('/movies/:movie_id')

//Get the user with a specific id http://localhost:8080/api/movies/:movie_id
    .get(function(req, res) {
        Movie.findById(req.params.imdb_number, function(err, movie) {
            if (err)
                res.send(err);
            res.json(movie);
        });
    });


//Register the routes
app.use('/api', router);

//Start the server
app.listen(port);
console.log('listening on port 8080')
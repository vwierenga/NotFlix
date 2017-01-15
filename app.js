/**
 * Created by Vincent on 10/7/2016.
 */

//Load packages
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('./config');
var app = express();

//Load models
var Movie = require('./models/movie');
var User = require('./models/user');
var Rating = require('./models/rating');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('secret', config.secret);

app.use(express.static('public'));

//Define port
var port = config.port;

var router = express.Router();

//Connect to notflix database
mongoose.connect(config.database);
var db = mongoose.connection;

db.once('open', function () {
    console.log('db: Connected!');
    db.db.dropDatabase();
    var movie = new Movie();
    movie.imdb_number = 1297919;
    movie.title = "Blitz";
    movie.published_at = new Date(20-5-2011);
    movie.length = 97;
    movie.director = "Elliott Lester";
    movie.short_description = "A tough cop is dispatched to take down a serial killer who has been targeting police officers.";
    movie.save(function (err) {
        if (err) {
            console.log("Movie not saved");
        } else {
            console.log("Movie added");
        }
    });

    var movie = new Movie();
    movie.imdb_number = 1904996;
    movie.title = "Parker";
    movie.published_at = new Date(8-3-2013);
    movie.length = 118;
    movie.director = "Taylor Hackford";
    movie.short_description = "A thief with a unique code of professional ethics is double-crossed by his crew and left for dead. Assuming a new disguise and forming an unlikely alliance with a woman on the inside, he looks to hijack the score of the crew's latest heist.";
    movie.save(function (err) {
        if (err) {
            console.log("Movie not saved");
        } else {
            console.log("Movie added");
        }
    });

    var movie = new Movie();
    movie.imdb_number = 1656190;
    movie.title = "Safe";
    movie.published_at = new Date(4-5-2012);
    movie.length = 94;
    movie.director = "Boaz Yakin";
    movie.short_description = "Mei, a young girl whose memory holds a priceless numerical code, finds herself pursued by the Triads, the Russian mob, and corrupt NYC cops. Coming to her aid is an ex-cage fighter whose life was destroyed by the gangsters on Mei's trail.";
    movie.save(function (err) {
        if (err) {
            console.log("Movie not saved");
        } else {
            console.log("Movie added");
        }
    });

    var movie = new Movie();
    movie.imdb_number = 200465;
    movie.title = "The Bank Job";
    movie.published_at = new Date(28-2-2008);
    movie.length = 111;
    movie.director = "Roger Donaldson";
    movie.short_description = "Martine offers Terry a lead on a foolproof bank hit on London's Baker Street. She targets a roomful of safe deposit boxes worth millions in cash and jewelry. But Terry and his crew don't realize the boxes also contain a treasure trove of dirty secrets - secrets that will thrust them into a deadly web of corruption and illicit scandal.";
    movie.save(function (err) {
        if (err) {
            console.log("Movie not saved");
        } else {
            console.log("Movie added");
        }
    });

    var movie = new Movie();
    movie.imdb_number = 479884;
    movie.title = "Crank";
    movie.published_at = new Date(1-9-2006);
    movie.length = 88;
    movie.director = "Mark Neveldine & Brian Taylor";
    movie.short_description = "Professional assassin Chev Chelios learns his rival has injected him with a poison that will kill him if his heart rate drops.";
    movie.save(function (err) {
        if (err) {
            console.log("Movie not saved");
        } else {
            console.log("Movie added");
        }
    });

    var user = new User();
    user.first_name = "Vincent";
    user.last_name = "Wierenga";
    user.username = "admin";
    user.password = "password";
    user.save(function (err) {
        if (err) {
            console.log("User not saved");
        } else {
            console.log("User added");
        }
    });

    var rating = new Rating();
    rating.by_user = "admin";
    rating.rating = 7;
    rating.imdb_number = 1656190;
    rating.save(function (err) {
        if (err) {
            console.log("Rating not saved");
        } else {
            console.log("Rating added");
        }
    });
});

//Test the connection to the database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to notflix database');
});

//Test the router
/*
router.get('/', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*').status(200).json({ message: 'hooray! welcome to our api!' });
}); */

//Code for /authenticate
//-------------------------------------------------------------------------------------------------------------
router.route('/authenticate')
    .post(function(req, res) {

        // find the user
        console.log(req.body.username);
        User.findOne({
            username: req.body.username

        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.header('Access-Control-Allow-Origin', '*').status(401).json({ error: true, success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.header('Access-Control-Allow-Origin', '*').status(401).json({ error: true, success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token
                    var payload = {
                        username: user.username
                    };

                    var token = jwt.sign(payload, app.get('secret'), {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    //console.log(jwt.decode(token))

                    // return the information including token as JSON
                    res.header('Access-Control-Allow-Origin', '*').status(200).json({
                        error: false,
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
            if (err) {
                res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
            }
            res.header('Access-Control-Allow-Origin', '*').status(200).json(movies);
        });
    });

router.route('/movies/:imdb_number')

    //Get the movie with a specific imdb id http://localhost:8080/api/movies/:imdb_number
    .get(function(req, res) {
        Movie.find({'imdb_number':req.params.imdb_number}, function(err, movie) {
            if (err) {
                res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
            } else {
                res.header('Access-Control-Allow-Origin', '*').status(200).json(movie);
            }
        });
    });

function searchRatings(movie) {
    Rating.find({'imdb_number':movie.imdb_number}, 'rating', function(err, ratings) {
        if (err) {
            res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
        }
        var totalscore = [0, 1];
        for (var j = 0, len = ratings.length; j < len; j++) {
            totalscore[j] = ratings[j].rating;
        }

        var ratedMovie = {};
        ratedMovie.title = movie.title;
        ratedMovie.imdb_number = movie.imdb_number;
        ratedMovie.published_at = movie.published_at;

        if (totalscore > 0) {
            ratedMovie.rating = (totalscore/totalscore.lenght);
        } else {
            ratedMovie.rating = 11;
        }
        console.log("totalscore: " + totalscore + "Length: " + totalscore.lenght)

        return ratedMovie;
    });

}

router.route('/movieswithrating')

//Get the movie with a rating http://localhost:8080/api/movieswithrating
    .get(function(req, res) {
        Movie.find(function(err, movies) {
            if (err) {
                res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
            }
            var ratedMovies = [];
            //fruits.push("Lemon");
            for (var i = 0, len = movies.length; i < len; i++) {
                var ratedMovie = searchRatings(movies[i]);
                if (typeof ratedMovie === "undefined") {
                    console.log("no rating");
                } else {
                    ratedMovies.push(ratedMovie);
                    console.log(ratedMovie);
                }
                /*
                if(ratedMovie.rating < 11) {
                    ratedMovies.push(ratedMovie);
                } */
            }
            //console.log(ratedMovies);
            res.header('Access-Control-Allow-Origin', '*').status(200).json(movies);
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

        if (user.surname_prefix === null) {
            user.surname_prefix = '';
        }

        if (user.last_name != null && user.first_name != null && user.username != null && user.password != null && user.username != '') {
            User.find({'username':user.username}, function(err, users) {
                if (err) {
                    res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
                }
                if (users.length < 1) {
                    //Save the user and check for errors
                    user.save(function(err) {
                        if (err) {
                            res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
                        } else {
                            res.header('Access-Control-Allow-Origin', '*').status(201).json({ message: 'User created!' });
                        }
                    });
                } else {
                    res.header('Access-Control-Allow-Origin', '*').status(409).json({ success: false, error: true, message: 'This username is taken!' });
                }
            });
        } else if(user.username === '' || user.username === null) {
            res.header('Access-Control-Allow-Origin', '*').status(409).json({ success: false, error: true, message: 'Missing or incorrect username' });
        } else if(user.password === null) {
            res.header('Access-Control-Allow-Origin', '*').status(409).json({ success: false, error: true, message: 'Missing password' });
        } else {
            res.header('Access-Control-Allow-Origin', '*').status(409).json({ success: false, error: true, message: 'Missing data' });
        }
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
                return res.header('Access-Control-Allow-Origin', '*').status(500).json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {

        // if there is no token
        // return an error
        return res.header('Access-Control-Allow-Origin', '*').status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.route('/users')

//Get all users http://localhost:8080/api/users
    .get(function(req, res) {
        User.find({}, 'first_name surname_prefix last_name username ', function(err, users) {
            if (err) {
                res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
            } else {
                res.header('Access-Control-Allow-Origin', '*').status(200).json(users);
            }
        });
    });

router.route('/users/:user_id')

//Get the user with a specific id http://localhost:8080/api/movies/:user_id
    .get(function(req, res) {
        User.findById(req.params.user_id, 'first_name surname_prefix last_name username ', function(err, user) {
            if (err) {
                res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
            } else {
                res.header('Access-Control-Allow-Origin', '*').status(200).json(user);
            }
        });
    });

//Code for /ratings
//-------------------------------------------------------------------------------------------------------------
router.route('/ratings')

//Create a rating with POST http://localhost:8080/api/ratings)
    .post(function(req, res) {

        var score = req.body.rating;

        if(!isNaN(score) && score >= 1 && score <= 10){ //Rating from 1 to 10, 1 = 0.5 stars, 10 = 5 stars

            if (req.body.imdb_number != null && req.body.rating != null && !isNaN(req.body.imdb_number)) {

                var newRating = new Rating();
                newRating.imdb_number = req.body.imdb_number;
                newRating.rating = req.body.rating;
                newRating.by_user = req.decoded.username;

                var alreadyexistingrating = true;

                var current_user = req.decoded.username;

                Rating.find({'imdb_number': req.body.imdb_number}, function (err, ratings) {
                    if (err) {
                        res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
                    }

                    if (typeof ratings[0] === "undefined") {
                        alreadyexistingrating = false;
                        //console.log("L270 Alreadyexistingrating = " + alreadyexistingrating);
                    } else {
                        var found = false;
                        for (var i = 0, len = ratings.length; i < len; i++) {
                            var rating = ratings[i];
                            if (rating.by_user === current_user){
                                found = true;
                            }
                        }
                        if (found === false) {
                            alreadyexistingrating = false;
                        }
                    }

                    if (!alreadyexistingrating) {
                        //Save the user and check for errors
                        newRating.save(function (err) {
                            if (err) {
                                res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
                            } else {
                                res.header('Access-Control-Allow-Origin', '*').status(201).json({message: 'Rating created!'});
                            }
                        });
                    } else {
                        res.header('Access-Control-Allow-Origin', '*').status(405).json({message: 'You cannot rate a movie more than once'});
                    }
                });

            } else {
                res.header('Access-Control-Allow-Origin', '*').status(409).json({ success: false, error: true, message: 'Missing or incorrect data' });
            }
        } else {
            res.header('Access-Control-Allow-Origin', '*').status(405).json({ message: 'The score should be between 1 and 10 inclusive' });
        }
    })

    //Get all ratings http://localhost:8080/api/ratings
    .get(function(req, res) {

        var current_user = req.decoded.username;

        Rating.find({'by_user':current_user},function(err, ratings) {
            if (err) {
                res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
            } else {
                res.header('Access-Control-Allow-Origin', '*').status(200).json(ratings);
            }
        });
    });

router.route('/ratings/:rating_id')

//Get the user with a specific id http://localhost:8080/api/ratings/:rating_id
    .get(function(req, res) {

        var current_user = req.decoded.username;

        Rating.findById(req.params.rating_id, function(err, rating) {
            if(rating != null && rating.by_user == current_user) {
                if (err) {
                    res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
                } else {
                    res.header('Access-Control-Allow-Origin', '*').status(200).json(rating);
                }
            } else {
                res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'You do not have the neccesary permissions to view this rating! :(' });
            }
        });
    })

    //Update the rating http://localhost:8080/api/ratings/:rating_id)
    .put(function(req, res) {

        var current_user = req.decoded.username;

        Rating.findById(req.params.rating_id, function(err, rating) {
            if (rating != null && rating.by_user == current_user) {
                if (err) {
                    res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
                }

                if(req.body.imdb_number != null && !isNaN(req.body.imdb_number)) {
                    rating.imdb_number = req.body.imdb_number;
                }
                if(req.body.rating != null && !isNaN(req.body.rating)){
                    rating.rating = req.body.rating;
                }

                // save the rating
                rating.save(function (err) {
                    if (err) {
                        res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
                    } else {
                        res.header('Access-Control-Allow-Origin', '*').status(200).json({message: 'Rating updated!'});
                    }
                });
            } else if (rating == null) {
                res.header('Access-Control-Allow-Origin', '*').status(204).json({ message: 'This rating does not exist :(' });
            } else {
                res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'You do not have the neccesary permissions to modify this rating! :(' });
            }
        });
    })

    //Delete the rating http://localhost:8080/api/ratings/:rating_id)
    .delete(function(req, res) {
        var current_user = req.decoded.username;

        Rating.findById(req.params.rating_id, function(err, rating) {
            if (rating != null && rating.by_user == current_user) {
                Rating.remove({
                    _id: req.params.rating_id
                }, function(err, rating) {
                    if (err) {
                        res.header('Access-Control-Allow-Origin', '*').status(500).send(err);
                    }

                    res.header('Access-Control-Allow-Origin', '*').status(200).json({ message: 'Rating deleted!' });
                });
            } else if (rating == null) {
                res.header('Access-Control-Allow-Origin', '*').status(204).json({ message: 'This rating does not exist :(' });
            } else {
                res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'You do not have the neccesary permissions to modify this rating! :(' });
            }
        });
    });


//Register the routes
app.use('/api', router);

//Start the server
app.listen(port);
console.log('listening on port 8080');

/*
var movie = new Movie();
movie.imdb_number = 1297919;
movie.title = "Blitz";
movie.published_at = new Date(20-5-2011);
movie.length = 97;
movie.director = "Elliott Lester";
movie.short_description = "A tough cop is dispatched to take down a serial killer who has been targeting police officers.";
movie.save(function (err) {
    if (err) {
        console.log("Movie not saved");
    } else {
        console.log("Movie added");
    }
});

var movie = new Movie();
movie.imdb_number = 1904996;
movie.title = "Parker";
movie.published_at = new Date(8-3-2013);
movie.length = 118;
movie.director = "Taylor Hackford";
movie.short_description = "A thief with a unique code of professional ethics is double-crossed by his crew and left for dead. Assuming a new disguise and forming an unlikely alliance with a woman on the inside, he looks to hijack the score of the crew's latest heist.";
movie.save(function (err) {
    if (err) {
        console.log("Movie not saved");
    } else {
        console.log("Movie added");
    }
});

var movie = new Movie();
movie.imdb_number = 1656190;
movie.title = "Safe";
movie.published_at = new Date(4-5-2012);
movie.length = 94;
movie.director = "Boaz Yakin";
movie.short_description = "Mei, a young girl whose memory holds a priceless numerical code, finds herself pursued by the Triads, the Russian mob, and corrupt NYC cops. Coming to her aid is an ex-cage fighter whose life was destroyed by the gangsters on Mei's trail.";
movie.save(function (err) {
    if (err) {
        console.log("Movie not saved");
    } else {
        console.log("Movie added");
    }
});

var movie = new Movie();
movie.imdb_number = 200465;
movie.title = "The Bank Job";
movie.published_at = new Date(28-2-2008);
movie.length = 111;
movie.director = "Roger Donaldson";
movie.short_description = "Martine offers Terry a lead on a foolproof bank hit on London's Baker Street. She targets a roomful of safe deposit boxes worth millions in cash and jewelry. But Terry and his crew don't realize the boxes also contain a treasure trove of dirty secrets - secrets that will thrust them into a deadly web of corruption and illicit scandal.";
movie.save(function (err) {
    if (err) {
        console.log("Movie not saved");
    } else {
        console.log("Movie added");
    }
});

var movie = new Movie();
movie.imdb_number = 479884;
movie.title = "Crank";
movie.published_at = new Date(1-9-2006);
movie.length = 88;
movie.director = "Mark Neveldine & Brian Taylor";
movie.short_description = "Professional assassin Chev Chelios learns his rival has injected him with a poison that will kill him if his heart rate drops.";
movie.save(function (err) {
    if (err) {
        console.log("Movie not saved");
    } else {
        console.log("Movie added");
    }
}); */


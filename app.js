/**
 * Created by Vincent on 10/12/2016.
 */

//Load packages
var mongoose = require('mongoose');
var express = require('express');
var app = express();

//Load models
var Movie = require('.app/models/movie')

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

//Register the routes
app.use('/api', router);

//Start the server
app.listen(port);
console.log('listening on port 8080')
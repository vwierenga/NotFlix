/**
 * Created by Vincent on 10/30/2016.
 */

$(document).ready(function() {
    getMovies();
    login("admin", "password");

    if (localStorage.username) {
        console.log(localStorage.getItem("username"));
    } else {
        console.log("No saved username");
    }

    if (localStorage.token) {
        console.log(localStorage.getItem("token"));
    } else {
        console.log("No saved token");
    }

    getMovieByImdbNumber(1656190);

    getUsers();
});

function getMovieByImdbNumber(imdbNumber) {
    $.ajax({
        type:'GET',
        url: "http://localhost:8080/api/movies/" + imdbNumber
    }).then(function(movieData) {
        for (var i = 0, len = movieData.length; i < len; i++) {
            displayMovieDetails(movieData[i])
        }
    });
}

function displayMovieDetails(movie) {
    var movieTitle = movie.title;
    var movieIMDBNumber = movie.imdb_number;
    var yourRating = 11;
    var userName = localStorage.getItem("username");


        $.ajax({
        type:'GET',
        url: "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&r=json"
    }).then(function(data) {
        var posterlink = data.Poster;
        $('#movieDetails').html(
            '<div class="movie col-sm-6 col-md-4 col-lg-2">' +
                '<h3 class="movieTitle" id="movieTitle">' + movieTitle + '</h3>' +
                '<p><img class="img-responsive movie-poster" id="moviePoster" src="' + posterlink + '" alt="Chania"> </p>' +
            '</div>' +
            '<div id="movieRatings" class="movie col-xs-12 col-sm-5 col-md-4 col-lg-2">' +
                '<h4>Ratings</h4>' +
                '<ul class="movieRatingList">' +
                    '<li id="averageRating">Movie not yet rated</li>' +
                    "<li id='yourRating'>You haven't rated this movie</li>" +
                '</ul>' +
            '</div>' +
            '<div class="movie col-sm-12 col-md-7 col-lg-9">' +
                '<h4>Description</h4>' +
                '<p>' + movie.short_description + '</p>' +
            '</div>'
        );

        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/ratings",
            headers: { 'x-access-token': localStorage.getItem("token") }
        }).then(function(ratingsData) {
            if(ratingsData.length > 0) {
                for (var i = 0, len = ratingsData.length; i < len; i++) {
                    var numberOfRatings = 0;
                    var totalRating = 0;
                    if (ratingsData[i].imdb_number == movieIMDBNumber) {
                        totalRating += ratingsData[i].rating;
                        numberOfRatings++;
                    }
                    if (ratingsData[i].by_user == userName) {
                        yourRating = ratingsData[i].rating;
                    }
                }

                var averageRating = totalRating/numberOfRatings;

                if(yourRating == 11){
                    var yourRatingText = "You haven't rated this movie"
                } else {
                    var yourRatingText = "Your rating: " + yourRating;
                }

                $('#movieRatings').html(
                    '<h4>Ratings</h4>' +
                    '<ul class="movieRatingList">' +
                    '<li id="averageRating">Average rating: ' + averageRating + '</li>' +
                    '<li id="yourRating">' + yourRatingText + '</li>' +
                    '</ul>'
                );
            }
        });
    });


}

function getMovies() {
    $.ajax({
        type:'GET',
        url: "http://localhost:8080/api/movies"
    }).then(function(movieData) {
        for (var i = 0, len = movieData.length; i < len; i++) {
            displayMovie(movieData[i].title, movieData[i].imdb_number)
        }
    });
}

function displayMovie(title, imdbNumber) {
    //http://www.omdbapi.com/?t=blitz&y=&plot=short&r=json
    $.ajax({
        type:'GET',
        url: "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json"
    }).then(function(data) {
        $("#movies").append("<div class='movie well col-sm-6 col-md-4 col-lg-2'> <h3 class='movieTitle'>" + title + "</h3> <p> <img class='img-responsive movie-poster' src='" + data.Poster + "' alt='Chania'> </p><p><a href='movieDetails.html?imdbnumber=" + imdbNumber + "'  class='btn btn-success'>More &raquo;</a></p></div>");
    });
}

function login(username, password) {
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/api/authenticate",
        data: { username: username, password: password }
    }).then(function(data) {
        //console.log(data.token);
        localStorage.setItem("username", username);
        localStorage.setItem("token", data.token);
    });
}

function getUsers() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/api/users",
        headers: { 'x-access-token': localStorage.getItem("token") }
    }).then(function(data) {
        console.log(data);
    });
}

function getRatings() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/api/ratings",
        headers: { 'x-access-token': localStorage.getItem("token") }
    }).then(function(data) {
        console.log(data);
    });
}




/**
 * Created by Vincent on 10/30/2016.
 */
var yourRatingID;

$(document).ready(function() {
    if (localStorage.username) {
        console.log(localStorage.getItem("username"));
    }

    if (localStorage.token) {
        console.log(localStorage.getItem("token"));
    }

    //movieDetails.html?imdbnumber=1656190
    var imdbNumber = findGetParameter('imdbnumber');
    if (imdbNumber != null && imdbNumber != ""){
        getMovieByImdbNumber(imdbNumber);
    }



});

/**
 * Get one movie from the server
 * @param imdbNumber the imdb number of the movie
 */
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

/**
 * Display the movie details in the detail page and add a rating and buttons when the user is logged in
 * @param movie the movie information
 */
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
            '<div id="movieRatings" class="movie col-xs-12 col-sm-5 col-md-4 col-lg-3">' +
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

                for (var i = 0, len = ratingsData.length; i < len; i++) {
                    var numberOfRatings = 0;
                    var totalRating = 0;
                    if (ratingsData[i].imdb_number == movieIMDBNumber) {
                        totalRating += ratingsData[i].rating;
                        numberOfRatings++;
                    }
                    if (ratingsData[i].by_user == userName && ratingsData[i].imdb_number == movieIMDBNumber) {
                        yourRating = ratingsData[i].rating;
                        yourRatingID = ratingsData[i]._id;
                    }
                }

                var averageRating = (totalRating/numberOfRatings)/2 +  " stars";
                if(numberOfRatings == 0){
                    averageRating = "Not available";
                }

                var yourRatingText;

                if(yourRating == 11){
                    yourRatingText = "You haven't rated this movie"
                } else {
                    yourRatingText = "Your rating: " + yourRating/2 + " stars";
                }

                if (yourRatingText == "You haven't rated this movie") {
                    $('#movieRatings').html(
                        '<h4>Ratings</h4>' +
                        '<ul class="movieRatingList">' +
                        '<li id="averageRating">Average rating: ' + averageRating + '</li>' +
                        '<li id="yourRating">' + yourRatingText + '</li>' +
                        '<li><button type="button" id="ratingZero" class="btn btn-success">0</button>' + '<button type="button" id="ratingOne" class="btn btn-success">1</button>' + '<button type="button" id="ratingTwo" class="btn btn-success">2</button> </li>' +
                        '<li><button type="button" id="ratingThree" class="btn btn-success">3</button>' + '<button type="button" id="ratingFour" class="btn btn-success">4</button>' + '<button type="button" id="ratingFive" class="btn btn-success">5</button> </li>' +
                        '</ul>'
                    );
                } else {
                    $('#movieRatings').html(
                        '<h4>Ratings</h4>' +
                        '<ul class="movieRatingList">' +
                        '<li id="averageRating">Average rating: ' + averageRating + '</li>' +
                        '<li id="yourRating">' + yourRatingText + '</li>' +
                        '<li><button type="button" id="ratingZero" class="btn btn-success">0</button>' + '<button type="button" id="ratingOne" class="btn btn-success">1</button>' + '<button type="button" id="ratingTwo" class="btn btn-success">2</button> </li>' +
                        '<li><button type="button" id="ratingThree" class="btn btn-success">3</button>' + '<button type="button" id="ratingFour" class="btn btn-success">4</button>' + '<button type="button" id="ratingFive" class="btn btn-success">5</button> </li>' +
                        '<li><button type="button" id="ratingDelete" class="btn btn-success">delete rating</button>' + '</li>' +
                        '</ul>'
                    );
                }

                $("#ratingZero").click(function(){
                    if(yourRatingID != "" && yourRatingID != null){
                        updateRating(yourRatingID, 0);
                        alert("wrong");
                    } else {
                        addRating(movieIMDBNumber, 0)
                    }
                });
            $("#ratingOne").click(function(){
                if(yourRatingID != "" && yourRatingID != null){
                    updateRating(yourRatingID, 1)
                } else {
                    addRating(movieIMDBNumber, 1)
                }
            });
            $("#ratingTwo").click(function(){
                if(yourRatingID != "" && yourRatingID != null){
                    updateRating(yourRatingID, 2)
                } else {
                    addRating(movieIMDBNumber, 2)
                }
            });
            $("#ratingThree").click(function(){
                if(yourRatingID != "" && yourRatingID != null){
                    updateRating(yourRatingID, 3)
                } else {
                    addRating(movieIMDBNumber, 3)
                }
            });
            $("#ratingFour").click(function(){
                if(yourRatingID != "" && yourRatingID != null){
                    updateRating(yourRatingID, 4)
                } else {
                    addRating(movieIMDBNumber, 4)
                }
            });
            $("#ratingFive").click(function(){
                if(yourRatingID != "" && yourRatingID != null){
                    updateRating(yourRatingID, 5)
                } else {
                    addRating(movieIMDBNumber, 5)
                }
            });

                $("#ratingDelete").click(function(){
                    if(yourRatingID != "" && yourRatingID != null){
                        deleteRating(yourRatingID)
                    }
                });

        });
    });


}

/**
 * Get a parameter from the url
 * @param parameterName the name of the parameter
 * @returns the get value
 */
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

/**
 * Delete a movie rating from the database
 * @param ratingID the _id of the rating
 */
function deleteRating(ratingID) {
    $.ajax({
        method: "DELETE",
        url: "http://localhost:8080/api/ratings/" + ratingID,
        headers: { 'x-access-token': localStorage.getItem("token") }
    }).then(function(ratingsData) {
        alert("Rating deleted! :)");
    });
}

/**
 * Change a rating in the database
 * @param ratingID the _id of the rating
 * @param rating the new rating for the movie
 */
function updateRating(ratingID, rating) {
    $.ajax({
        method: "PUT",
        url: "http://localhost:8080/api/ratings/" + ratingID,
        headers: { 'x-access-token': localStorage.getItem("token") },
        data: { rating: (rating * 2)}
    }).then(function(ratingsData) {
        alert("Rating updated! :)");
    });
}

/**
 * Add a new rating to the database
 * @param imdbNumber the imdb number of the movie the rating is for
 * @param rating the rating
 */
function addRating(imdbNumber, rating) {
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/api/ratings",
        headers: { 'x-access-token': localStorage.getItem("token") },
        data: { imdb_number: imdbNumber, rating: (rating * 2), by_user: localStorage.getItem("username") }
    }).then(function(data) {
        alert("Rating created! :)");
    });
}





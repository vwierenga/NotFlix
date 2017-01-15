/**
 * Created by Vincent on 10/30/2016.
 */

$(document).ready(function() {
    if (localStorage.username) {
        console.log(localStorage.getItem("username"));
    } else {
        window.location.href = "login.html";
    }

    if (localStorage.token) {
        console.log(localStorage.getItem("token"));
    } else {
        window.location.href = "login.html";
    }

    //movieDetails.html?imdbnumber=1656190
    var imdbNumber = findGetParameter('imdbnumber');
    if (imdbNumber != null && imdbNumber != ""){
        getMovieByImdbNumber(imdbNumber);
    }
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
            headers: { 'x-access-token': localStorage.getItem("token") },
            error: function (xhr, ajaxOptions, thrownError) {
                if(xhr.status == 500 || xhr.status == 403) {
                    alert("Please log in");
                    console.log(xhr.status);
                    window.location.href = "login.html";
                }
            }
        }).then(function(ratingsData) {
            if(ratingsData.length > 0) {
                for (var i = 0, len = ratingsData.length; i < len; i++) {
                    var numberOfRatings = 0;
                    var totalRating = 0;
                    if (ratingsData[i].imdb_number == movieIMDBNumber) {
                        totalRating += ratingsData[i].rating;
                        numberOfRatings++;
                    }
                    if (ratingsData[i].by_user == userName && ratingsData[i].imdb_number == movieIMDBNumber) {
                        yourRating = ratingsData[i].rating;
                    }
                }

                var averageRating = totalRating/numberOfRatings;
                if(numberOfRatings == 0){
                    averageRating = "Not available";
                }

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




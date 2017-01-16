/**
 * Created by Vincent on 10/30/2016.
 */

$(document).ready(function() {
    if (localStorage.username) {
        console.log(localStorage.getItem("username"));
    }

    if (localStorage.token) {
        console.log(localStorage.getItem("token"));
    }

    getMovies();
});

/**
 * Get all movies from the server
 */
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

/**
 * display a movie
 * @param title the title of the movie
 * @param imdbNumber the imdb number of the movie
 */
function displayMovie(title, imdbNumber) {
    //http://www.omdbapi.com/?t=blitz&y=&plot=short&r=json
    $.ajax({
        type:'GET',
        url: "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json"
    }).then(function(data) {
        $("#movies").append("<div class='movie well col-sm-6 col-md-4 col-lg-2'> <h3 class='movieTitle'>" + title + "</h3> <p> <img class='img-responsive movie-poster' src='" + data.Poster + "' alt='Chania'> </p><p><a href='movieDetails.html?imdbnumber=" + imdbNumber + "'  class='btn btn-success'>More &raquo;</a></p></div>");
    });
}




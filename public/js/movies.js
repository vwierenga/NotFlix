/**
 * Created by Vincent on 10/30/2016.
 */

$(document).ready(function() {
    getMovies();
    login("vwierenga", "password");

    getUsers();
});

function getMovies() {
    $.ajax({
        type:'GET',
        url: "http://localhost:8080/api/movies"
    }).then(function(movieData) {
        for (var i = 0, len = movieData.length; i < len; i++) {
            displayMovie(movieData[i].title)
        }
    });
}

function displayMovie(title) {
    //http://www.omdbapi.com/?t=blitz&y=&plot=short&r=json
    $.ajax({
        type:'GET',
        url: "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json"
    }).then(function(data) {
        $("#movies").append("<div class='col-sm-6 col-md-4 col-lg-2'> <h3>" + title + "</h3> <p> <img class='img-responsive movie-poster' src='" + data.Poster + "' alt='Chania'> </p><p><button class='btn btn-success'>More &raquo;</button></p></div>");
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
    if (localStorage.username) {
        console.log(localStorage.getItem("username"));
    } else {
        console.log("No saved username");
        alert("You're not logged in :(");
    }

    if (localStorage.token) {
        console.log(localStorage.getItem("token"));
    } else {
        console.log("No saved token");
        alert("You're not logged in :(");
    }

    var token = localStorage.getItem("token");

    $.ajax({
        method: "GET",
        url: "http://localhost:8080/api/users",
        headers: { 'x-access-token': token }
    }).then(function(data) {
        console.log(data);
    });
}




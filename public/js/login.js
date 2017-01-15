/**
 * Created by Vincent on 10/30/2016.
 */

$(document).ready(function() {
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

    $("#btnRegister").click(function(){
        register();
    });

    $("#btnLogin").click(function(){
        var username = document.forms["signin"]["loginUsername"].value;
        var password = document.forms["signin"]["loginPassword"].value;

        login(username, password);
    });
});

function login(username, password) {
    if (username == null || username == "" || password == null || password == "") {
        alert("Please enter a username and password ");
    } else {
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/api/authenticate",
            data: {username: username, password: password}
        }).then(function (data) {
            localStorage.setItem("username", username);
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        });
    }
}

function register() {
    var username = document.forms["signup"]["registerUsername"].value;
    var password = document.forms["signup"]["registerPassword"].value;
    var lastName = document.forms["signup"]["registerLastName"].value;
    var surnamePrefix = document.forms["signup"]["registerSurnamePrefix"].value;
    var firstName = document.forms["signup"]["registerFirstName"].value;

    console.log(username + password + lastName + surnamePrefix + firstName);

    if (username == null || username == "" || password == null || password == "") {
        alert("Please enter a username and password ");
    } else {
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/api/users",
            data: { username: username, password: password, last_name: lastName, surname_prefix: surnamePrefix, first_name: firstName }
        }).then(function(data) {
            alert("Account created! :)");
        });
    }
}




/**
 * Created by Vincent on 10/30/2016.
 */

$(document).ready(function() {
    getUsers();
    $("#btnLogin").click(function(){
        $("#loginDiv").hide();
        alert("button");
    });
});

/**
 * Display one user in the user overview
 * @param user the user whose name gets displayed
 */
function displayUser(user) {
    //http://www.omdbapi.com/?t=blitz&y=&plot=short&r=json
    $("#users").append("<div class='col-sm-6 col-md-4 col-lg-2'> <h3>" + user.username + "</h3> <p><a href='userDetails.html?userid=" + user._id + "' class='btn btn-success'>More &raquo;</a></p></div>");
}

/**
 * Checks if the current user on the site is logged in and gets every user from the database.
 */
function getUsers() {
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

    var token = localStorage.getItem("token");

    $.ajax({
        method: "GET",
        url: "http://localhost:8080/api/users",
        headers: { 'x-access-token': token },
        error: function (xhr, ajaxOptions, thrownError) {
            if(xhr.status == 500 || xhr.status == 403) {
                alert("Please log in");
                console.log(xhr.status);
                window.location.href = "login.html"; //Redirect the user to the login page if he/she isn't logged in.
            }
        }
    }).then(function(userData) {
        console.log(userData);
        for (var i = 0, len = userData.length; i < len; i++) {
            displayUser(userData[i])
        }
    });
}




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

function displayUser(user) {
    //http://www.omdbapi.com/?t=blitz&y=&plot=short&r=json
    $("#users").append("<div class='col-sm-6 col-md-4 col-lg-2'> <h3>" + user.username + "</h3> <p><a href='userDetails.html?userid=" + user._id + "' class='btn btn-success'>More &raquo;</a></p></div>");
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
        headers: { 'x-access-token': token },
        error: function (xhr, ajaxOptions, thrownError) {
            if(xhr.status == 500 || xhr.status == 403) {
                alert("Please log in");
                console.log(xhr.status);
                window.location.href = "login.html";
            }
        }
    }).then(function(userData) {
        console.log(userData);
        for (var i = 0, len = userData.length; i < len; i++) {
            displayUser(userData[i])
        }
    });
}




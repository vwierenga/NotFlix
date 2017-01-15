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
    var userid = findGetParameter('userid');

    if (userid != null && userid != ""){
        getUserById(userid);
    }
});

function getUserById(id) {
    var token = localStorage.getItem("token");
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/api/users/" + id,
        headers: { 'x-access-token': token },
        error: function (xhr, ajaxOptions, thrownError) {
            if(xhr.status == 500 || xhr.status == 403) {
                alert("Please log in");
                console.log(xhr.status);
                window.location.href = "login.html";
            }
        }
    }).then(function(userData) {
        displayUserDetails(userData);
    });
}

function displayUserDetails(user) {
    var surnamePrefix = "";
    if(user.surname_prefix != null && user.surname_prefix != "") {
        surnamePrefix = user.surname_prefix + " ";
    }
    $('#userDetails').html(
        '<h4>User details:</h4>' +
        '<p >Username: ' + user.username + '</p>' +
        '<p >Name: ' + user.first_name + ' ' + surnamePrefix + user.last_name + '</p>'
    );
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




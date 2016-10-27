/**
 * Created by Rick on 27-10-2016.
 */

function showRegister(){
    document.getElementById('registerDiv').style.display = 'block';
    document.getElementById('loginButtons').style.display = 'none';
}

function hideRegister(){

}

function login(){
    console.log('login functie');
}

function register(){
    console.log('register functie');
    //http://localhost:8080/api/users;
    //body:
        //username
        //password
        //last_name
        //first_name
        //surname_prefix
}
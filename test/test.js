/**
 * Created by Vincent on 10/10/2016.
 */
var should = require("should");
var mocha = require("mocha");
var supertest = require("supertest");
var assert = require('assert');


// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:8080");

// UNIT test begin

describe("Movies",function(){

    // #1 should return home page

    it("Should return movies",function(done){

        // calling movie api
        server
            .get("/api/movies/")
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.statusCode.should.equal(200);
                // Error key should be false.
                res.error.should.equal(false);
                done();
            });
    });

    it("Should return movie",function(done){

        // calling movie api
        server
            .get("/api/movies/0402910")
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.statusCode.should.equal(200);
                // Error key should be false.
                res.error.should.equal(false);
                done();
            });
    });

    it("Should return movies with rating",function(done){

        // calling movie api
        server
            .get("/api/movieswithrating")
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.statusCode.should.equal(200);
                // Error key should be false.
                res.error.should.equal(false);
                done();
            });
    });

});

describe("Authenticate",function(){

    // #1 should return home page

    it("Correct login should return token",function(done){

        // calling movie api
        server
            .post("/api/authenticate/")
            .send({'username': 'admin', 'password': 'password'})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.statusCode.should.equal(200);
                // Error key should be false.
                res.error.should.equal(false);
                done();
            });
    });

    it("Wrong password should return 401",function(done){

        // calling movie api
        server
            .post("/api/authenticate/")
            .send({'username': 'admin', 'password': 'passsword'})
            .expect("Content-type",/json/)
            .expect(401) // THis is HTTP response
            .end(function(err,res){
                res.statusCode.should.equal(401);
                //res.message.should.equal('Authentication failed. Wrong password.');
                done();
            });
    });

    it("Wrong username should return 401",function(done){

        // calling movie api
        server
            .post("/api/authenticate/")
            .send({'username': 'adminn', 'password': 'password'})
            .expect("Content-type",/json/)
            .expect(401) // THis is HTTP response
            .end(function(err,res){
                res.statusCode.should.equal(401);
                //res.message.should.equal('Authentication failed. Wrong password.');
                done();
            });
    });

});


describe("Users",function(){

    //todo uncomment user creation

    /*
    it("Adds new user should return 201",function(done){

        // calling movie api
        server
            .post("/api/users/")
            .send({'last_name': 'Anders', 'surname_prefix': '', 'first_name': 'Iemand', 'username': 'testuser', 'password': 'password'})
            .expect("Content-type",/json/)
            .expect(409) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.statusCode.should.equal(409);
                // Error key should be false.
                done();
            });
    });
    */

    it("Adds existing user should return 409",function(done){

        // calling movie api
        server
            .post("/api/users/")
            .send({'last_name': 'Anders', 'surname_prefix': '', 'first_name': 'Iemand', 'username': 'admin', 'password': 'password'})
            .expect("Content-type",/json/)
            .expect(409) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.statusCode.should.equal(409);
                // Error key should be false.
                done();
            });
    });

    it("Adds user without username should return 409",function(done){

        // calling movie api
        server
            .post("/api/users/")
            .send({'last_name': 'Anders', 'surname_prefix': '', 'first_name': 'Iemand', 'password': 'password'})
            .expect("Content-type",/json/)
            .expect(409) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.statusCode.should.equal(409);
                // Error key should be false.
                done();
            });
    });

    it("Adds user without password should return 409",function(done){

        // calling movie api
        server
            .post("/api/users/")
            .send({'last_name': 'Anders', 'surname_prefix': '', 'first_name': 'Iemand', 'username': 'admin'})
            .expect("Content-type",/json/)
            .expect(409) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.statusCode.should.equal(409);
                // Error key should be false.
                done();
            });
    });

    it("Adds user without other data should return 409",function(done){

        // calling movie api
        server
            .post("/api/users/")
            .send({'last_name': 'Anders', 'surname_prefix': '', 'first_name': 'Iemand', 'username': 'admin', 'password': 'password'})
            .expect("Content-type",/json/)
            .expect(409) // THis is HTTP response
            .end(function(err,res){
                res.statusCode.should.equal(409);
                done();
            });
    });

    it("Should return users",function(done){

        // todo replace token with new token before starting the test.
        server
            .get("/api/users/")
            .set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDc3NTY3NjQ0LCJleHAiOjE0Nzc2NTQwNDR9.SmwAZuFOx1kGvyfdVOvUEWrtODF1tt0J5W_r46DndYU'})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.statusCode.should.equal(200);
                // Error key should be false.
                res.error.should.equal(false);
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('username');
                res.body[0].should.have.property('first_name');
                res.body[0].should.have.property('last_name');
                res.body[0].should.have.property('surname_prefix');
                done();
            });
    });

    it("Should return one user",function(done){

        // todo replace token with new token before starting the test.
        server
            .get("/api/users/57fe1e3fa4329a14bc935224")
            .set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDc3NTY3NjQ0LCJleHAiOjE0Nzc2NTQwNDR9.SmwAZuFOx1kGvyfdVOvUEWrtODF1tt0J5W_r46DndYU'})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.statusCode.should.equal(200);
                // Error key should be false.
                res.error.should.equal(false);
                res.body.should.have.property('_id');
                res.body.should.have.property('username');
                res.body.should.have.property('first_name');
                res.body.should.have.property('last_name');
                res.body.should.have.property('surname_prefix');
                res.body._id.should.equal('57fe1e3fa4329a14bc935224');
                res.body.username.should.equal('vwierenga');
                res.body.first_name.should.equal('Vincent');
                res.body.last_name.should.equal('Wierenga');
                res.body.surname_prefix.should.equal('');
                done();
            });
    });
});



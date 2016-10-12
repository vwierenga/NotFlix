/**
 * Created by Vincent on 10/10/2016.
 */
var mocha = require("mocha");
var supertest = require("supertest");
var should = require("should");
var assert = require('assert');


// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:8080");

// UNIT test begin

describe("SAMPLE unit test",function(){

    // #1 should return home page

    it("should return home page",function(done){

        // calling home page api
        server
            .get("/api/")
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(200);
                // Error key should be false.
                res.body.error.should.equal(false);
                done();
            });
    });

});
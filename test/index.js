const assert = require('assert');
const request = require('request');
const config = require('config');
const _ = require('underscore');
const hostUrl = 'http://localhost:' + config.get('port');
describe('GET /decks', function() {

    it('should return a 200', function(done) {

        request({
            url: hostUrl + '/decks',
            json:true
        }, function (err, response, body) {
            if(err) return done(err);
            if(!response){
                return done(new Error("No response found"));
            }
            if(response.statusCode != 200){
                return done(new Error("Invalid status code: " + response.statusCode));
            }
            if(!_.isArray(body)){
                return done(new Error("Response was not an array"));
            }
            if(body.length < 1){
                return done(new Error("Array is empty"));
            }
            return done();
        });
    });



});

describe('POST /decks', ()=>{

    it('should return a 400 with out a name', function(done) {

        request({
            method: 'POST',
            url: hostUrl + '/decks',
            json:true,
            body:{ }
        }, function (err, response, body) {
            if(err) return done(err);
            if(!response){
                return done(new Error("No response found"));
            }
            if(response.statusCode != 400){
                return done(new Error("Invalid status code: " + response.statusCode));
            }

            return done();
        });
    });
    it('should return a 200', function(done) {

        request({
            method: 'POST',
            url: hostUrl + '/decks',
            json:true,
            body:{
                name:"Test deck"
            }
        }, function (err, response, body) {
            if(err) return done(err);
            if(!response){
                return done(new Error("No response found"));
            }
            if(response.statusCode != 200){
                return done(new Error("Invalid status code: " + response.statusCode));
            }
            if(!_.isObject(body)){
                return done(new Error("Response was not an Object"));
            }
            if(!body.name){
                return done(new Error("Deck has no name"));
            }
            return done();
        });
    });
})
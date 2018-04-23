const assert = require('assert');
const request = require('request');
const config = require('config');
const _ = require('underscore');
const hostUrl = 'http://localhost:' + config.get('port');
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjQ1MDA3NTl9.BGK8AGRaJg3vHwPmMQJ58QNts_ZE0Y9gpkPDvWp7p6U';
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
    it('should return a 401 with out a JWT token', function(done) {

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
            if(response.statusCode != 401){
                return done(new Error("Invalid status code: " + response.statusCode));
            }

            return done();
        });
    });
    it('should return a 400 with out a name', function(done) {

        request({
            method: 'POST',
            url: hostUrl + '/decks',
            json:true,
            'auth': {
                'bearer': JWT
            },
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
            'auth': {
                'bearer': JWT
            },
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

describe('GET /decks/:deck', function() {

    it('should return a 200', function(done) {

        request({
            url: hostUrl + '/decks/circle',
            json:true
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
    it('should return a 404', function(done) {

        request({
            url: hostUrl + '/decks/imadeckthatdoesntexist',
            json:true
        }, function (err, response, body) {
            if(err) return done(err);
            if(!response){
                return done(new Error("No response found"));
            }
            if(response.statusCode != 404){
                return done(new Error("Invalid status code: " + response.statusCode));
            }
            if(!_.isObject(body)){
                return done(new Error("Response was not an object"));
            }
            if(!body.error || !body.error.message){
                return done(new Error("Missing error message"));
            }
            return done();
        });
    });



});

describe('GET /decks/:deck/cards', function() {

    it('should return a 200', function (done) {

        request({
            url: hostUrl + '/decks/circle/cards',
            json: true
        }, function (err, response, body) {
            if (err) return done(err);
            if (!response) {
                return done(new Error("No response found"));
            }
            if (response.statusCode != 200) {
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

describe('POST /decks/:deck/cards', function() {

    it('should return a 401 with out a JWT', function (done) {

        request({
            url: hostUrl + '/decks/circle/cards',
            json: true,
            method: 'POST',
            body:{
                number:'G',
                suit:'H',
                rule:'Put a lamp shade on your head'
            }
        }, function (err, response, body) {
            if (err) return done(err);
            if (!response) {
                return done(new Error("No response found"));
            }
            if (response.statusCode != 401) {
                return done(new Error("Invalid status code: " + response.statusCode));
            }
            /*if(!_.isObject(body)){
                return done(new Error("Response was not an object"));
            }
            if(!body.error || !body.error.message){
                return done(new Error("Missing error message"));
            }*/
            return done();
        });
    });


    it('should return a 400 with a bad `number`', function (done) {

        request({
            url: hostUrl + '/decks/circle/cards',
            json: true,
            method: 'POST',
            'auth': {
                'bearer': JWT
            },
            body:{
                number:'G',
                suit:'H',
                rule:'Put a lamp shade on your head'
            }
        }, function (err, response, body) {
            if (err) return done(err);
            if (!response) {
                return done(new Error("No response found"));
            }
            if (response.statusCode != 400) {
                return done(new Error("Invalid status code: " + response.statusCode));
            }
            if(!_.isObject(body)){
                return done(new Error("Response was not an object"));
            }
            if(!body.error || !body.error.message){
                return done(new Error("Missing error message"));
            }
            return done();
        });
    });
    it('should return a 400 with a bad `suit`', function (done) {

        request({
            url: hostUrl + '/decks/circle/cards',
            json: true,
            method: 'POST',
            'auth': {
                'bearer': JWT
            },
            body:{
                number:'K',
                suit:'P',
                rule:'Put a lamp shade on your head'
            }
        }, function (err, response, body) {
            if (err) return done(err);
            if (!response) {
                return done(new Error("No response found"));
            }
            if (response.statusCode != 400) {
                return done(new Error("Invalid status code: " + response.statusCode));
            }
            if(!_.isObject(body)){
                return done(new Error("Response was not an object"));
            }
            if(!body.error || !body.error.message){
                return done(new Error("Missing error message"));
            }
            return done();
        });
    });

    it('should return a 200', function (done) {

        request({
            url: hostUrl + '/decks/circle/cards',
            json: true,
            method: 'POST',
            'auth': {
                'bearer': JWT
            },
            body:{
                number:'K',
                suit:'H',
                rule:'Put a lamp shade on your head'
            }
        }, function (err, response, body) {
            if (err) return done(err);
            if (!response) {
                return done(new Error("No response found"));
            }
            if (response.statusCode != 200) {
                return done(new Error("Invalid status code: " + response.statusCode));
            }
            if(!_.isObject(body)){
                return done(new Error("Response was not an object"));
            }
            if(!body.suit || !body.number || !body.rule){
                return done(new Error("Missing fields"));
            }
            return done();
        });
    });
});




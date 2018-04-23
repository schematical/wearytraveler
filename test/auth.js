const assert = require('assert');
const request = require('request');
const config = require('config');
const _ = require('underscore');
const hostUrl = 'http://localhost:' + config.get('port');
const PASSWORD = '0asdffn03m!-*$&oOKFJF023';
const USERNAME = 'test_' + new Date().getTime();
describe('POST /register', function() {


    it('should return a 200', function (done) {

        request({
            url: hostUrl + '/register',
            json: true,
            method: 'POST',
            body:{
                username: USERNAME,
                password: PASSWORD
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
            if(!body.username){
                return done(new Error("Missing fields"));
            }
            if(body.salt || body.hash){
                return done(new Error("Insecure fields exposed"));
            }
            return done();
        });
    });
});

describe('POST /login', function() {


    it('should return a 200', function (done) {

        request({
            url: hostUrl + '/login',
            json: true,
            method: 'POST',
            body:{
                username: USERNAME,
                password: PASSWORD
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
            if(!body.jwt){
                return done(new Error("Missing fields"));
            }
            if(body.salt || body.hash){
                return done(new Error("Insecure fields exposed"));
            }
            console.log(body);
            return done();
        });
    });
});

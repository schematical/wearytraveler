const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const passportLocalMongoose = require('passport-local-mongoose');
module.exports = (app)=>{
    const Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    const User = new Schema({
        name: String,
        username: String,
        password: String

    });
    User.methods.getJWT = ()=>{
        var token = jwt.sign({ sub: this._id }, config.get('auth.secret'));
        return token;
    }
    User.options.toObject = User.options.toObject || {};
    User.options.toObject.transform = function (doc, ret, options) {
        // remove the _id of every document before returning the result
        delete ret.salt;
        delete ret.hash;
        return ret;
    }
    User.plugin(passportLocalMongoose);

    app.mongo.User = mongoose.model('User', User);
}
const mongoose = require('mongoose');
module.exports = (app)=>{
    const Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    const User = new Schema({
        name: String,

    });
    app.mongo.User = mongoose.model('User', User);
}
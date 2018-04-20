const mongoose = require('mongoose');
module.exports = (app)=>{
    const Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    const Deck = new Schema({
        name: String,
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        namespaces:{
            type:String
        }
    });
    app.mongo.Deck = mongoose.model('Deck', Deck);
}
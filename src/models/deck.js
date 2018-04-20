const mongoose = require('mongoose');
module.exports = (app)=>{
    const Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    const Deck = new Schema({
        name: String,
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        namespace:{
            type:String
        },
        forked: { type: Schema.Types.ObjectId, ref: 'Deck' }
    });
    app.mongo.Deck = mongoose.model('Deck', Deck);
}
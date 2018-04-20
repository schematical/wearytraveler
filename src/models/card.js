const mongoose = require('mongoose');
module.exports = (app)=>{
    const Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    const Card = new Schema({
        suit: String,
        number: String,//K, Q, J, A
        rule: String,
        deck: { type: Schema.Types.ObjectId, ref: 'Deck' },
    });
    app.mongo.Card = mongoose.model('Card', Card);
}
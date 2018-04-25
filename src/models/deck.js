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
    Deck.methods.setupCards = function(options){
        let promises = [];
        Object.keys(app.enum.cardNumbers).forEach((key)=>{
            promises.push(new Promise((resolve, reject)=>{
                let card = new app.mongo.Card({
                    rule:null,
                    number: key,
                    suit: app.enum.suits.A,
                    deck: this._id
                })
                card.save((err)=>{
                    if(err) return reject(err);
                    return resolve(card);
                })
            }))
        })
        return Promise.all(promises);
    }
    app.mongo.Deck = mongoose.model('Deck', Deck);
}
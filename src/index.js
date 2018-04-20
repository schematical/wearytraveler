const config = require('config');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const app = express()

require('./models')(app);
require('./enum')(app);
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Hello Traveler!')
})
app.param('deck', function(req, res, next, id) {
    let query = { _id: id };

    if( !mongoose.Types.ObjectId.isValid(id) ){
        query = { namespace: id };
    }
    return app.mongo.Deck.findOne(query).exec((err, deck)=>{
        if(err) return next(err);
        req.deck = deck;
        return next();
    })
})

app.get('/decks', (req, res) => {
    return app.mongo.Deck.find({}).exec((err, decks)=>{
        return res.json(decks);
    })
})
app.post('/decks', (req, res) => {
    if(!req.body.name){
        return res.status(400).json({
            error:{
                message:"Missing `name` field"
            }
        })
    }
    let deck = new app.mongo.Deck({
        name: req.body.name,
        namespace: req.body.namespace
    })
    return deck.save((err, deck)=>{
        return res.json(deck.toObject());
    })
})
app.get('/decks/:deck', (req, res) => {
    if(!req.deck){
        return res.status(404).json({
            error:{
                message:"No deck found"
            }
        });
    }
    return res.json(req.deck.toObject());

})
app.get('/decks/:deck/cards', (req, res) => {
    if(!req.deck){
        return res.status(404).json({
            error:{
                message:"No deck found"
            }
        });
    }
    return app.mongo.Card.find({
        deck: req.deck._id
    }).exec((err, cards)=>{
        if(err) return next(err);

        return res.json(cards);
    })

})
app.post('/decks/:deck/cards', (req, res) => {
    if(!req.deck){
        return res.status(404).json({
            error:{
                message:"No deck found"
            }
        });
    }
    let missingFields = [];
    if(!req.body.suit){
        missingFields.push('suit')
    }
    if(!req.body.number){
        missingFields.push('number')
    }
    if(!req.body.rule){
        missingFields.push('rule')
    }

    if(missingFields.length > 0){
        return res.status(400).json({
            error:{
                message:"Missing fields: " + missingFields.join(', ')
            }
        })
    }
    if(!app.enum.cardNumbers[req.body.number]){
        return res.status(400).json({
            error:{
                message:"Invalid `number` passed in: " + req.body.number
            }
        })
    }
    if(!app.enum.suits[req.body.suit]){
        return res.status(400).json({
            error:{
                message:"Invalid `suit` passed in: " + req.body.number
            }
        })
    }
    let p = new Promise((resolve, reject)=>{
        return app.mongo.Card.findOne({
            suit: req.body.suit,
            number: req.body.number,
            deck: req.deck._id
        }).exec((err, card)=>{
            if(err) return reject(err);
            return resolve(card);
        })
    })
    p.then((card)=>{
        return new Promise((resolve, reject)=> {
            if (!card) {
                card = new app.mongo.Card();
            }
            card.suit =  req.body.suit;
            card.number = req.body.number;
            card.rule = req.body.rule;
            card.deck = req.deck._id;

            return card.save((err, card) => {
                if (err) return reject(err);
                return resolve(card);
            })

        });

    })
    .then((card)=>{
        return res.json(card.toObject());
    })
    .catch((err)=>{
        return next(err);
    })

})
app.listen(config.get('port'), () => {
    console.log('Example app listening on port ' + config.get('port') + ' !')
})
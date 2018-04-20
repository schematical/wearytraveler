const config = require('config');
const bodyParser = require('body-parser');
const express = require('express');

const app = express()

require('./models')(app);
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Hello Traveler!')
})
app.get('/decks', (req, res) => {
    app.mongo.Deck.find({}).exec((err, decks)=>{
        res.json(decks);
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
        name: req.body.name
    })
    return deck.save((err, deck)=>{
        return res.json(deck.toObject());
    })
})
app.listen(config.get('port'), () => {
    console.log('Example app listening on port ' + config.get('port') + ' !')
})
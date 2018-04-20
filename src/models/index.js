const mongoose = require('mongoose');
const config = require('config');
module.exports = (app)=>{
    mongoose.connect(config.get('mongo.url'));
    app.mongo = {};
    require('./card')(app);
    require('./deck')(app);
    require('./user')(app);
}
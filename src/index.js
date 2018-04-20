const config = require('config');

const express = require('express');


const app = express()

require('./models')(app);
require('./enum')(app);
require('./routes')(app);
app.listen(config.get('port'), () => {
    console.log('Example app listening on port ' + config.get('port') + ' !')
})
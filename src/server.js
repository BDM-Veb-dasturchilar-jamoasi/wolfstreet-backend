const express = require("express");
const app = express();

require('./startup/logging')();
require('./startup/db')();
const { port } = require('./startup/config');
require('./startup/routes')(app);
require('./startup/migration')();
require('./cron')


app.listen(port, () => console.log(`🚀 Server ${port}da suzyapti!`))
    .on('error', (e) => {
        console.log('Error happened: ', e.message)
    });

module.exports = app;
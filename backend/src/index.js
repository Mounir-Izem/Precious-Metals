const express = require('express');
const {router: healthRouter} = require('./routes/health.js');
const {router: spotRouter} = require('./routes/spot.js')
require('./crons/spotCron.js');


const port = process.env.PORT || 3000;

const app = express();

app.listen(port, () => {
    console.log(`Serveur runing on port ${port}`)
});

app.use('/health', healthRouter);

app.use('/spot', spotRouter);
const express = require('express');
const {router: healthRouter} = require('./routes/health.js');
const {router: spotRouter} = require('./routes/spot.js')
require('./crons/spotCron.js');
const helmet = require('helmet')
const cors = require('cors')
const expressRateLimit = require('express-rate-limit')


const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(helmet());

const limiter = expressRateLimit({
    windowMs: 900000,
    max: 100
})

app.use(limiter)

app.use('/health', healthRouter);

app.use('/spot', spotRouter);

app.listen(port, () => {
    console.log(`Serveur runing on port ${port}`)
});
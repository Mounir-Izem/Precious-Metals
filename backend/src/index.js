const express = require('express');
const {router} = require('./routes/health.js');


const port = process.env.PORT || 3000;

const app = express();

app.listen(port, () => {
    console.log(`Serveur runing on port ${port}`)
});

app.use('/health', router);
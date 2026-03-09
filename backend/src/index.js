const express = require('express');
const healthRouter = require('./routes/health');
const coinsRouter = require('./routes/coins');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(healthRouter);
app.use(coinsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

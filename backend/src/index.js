const express = require('express');
const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(healthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

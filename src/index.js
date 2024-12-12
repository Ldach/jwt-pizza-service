const express = require('express'); 
const metrics = require('./metrics.js'); 

const app = express();

app.use(metrics.requestTracker);

const port = process.argv[2] || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

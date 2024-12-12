const express = require('express');
const app = require('./service.js');
const { trackRequest } = require('./metrics.js');

const port = process.argv[2] || 3000;

app.use(trackRequest);

sendMetricsPeriodically(5 * 60 * 1000); 

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

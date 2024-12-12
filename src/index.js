const app = require('./service.js');
const { requestTracker } = require('./metrics.js');

const port = process.argv[2] || 3000;

app.use(requestTracker);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

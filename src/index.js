const app = require('./service.js');
const metrics = require('./metrics.js');  

const port = process.argv[2] || 3000;

app.use((req, res, next) => {
  metrics.incrementRequests();

  if (req.method === 'GET') {
    metrics.incrementGetRequests();
  } else if (req.method === 'POST') {
    metrics.incrementPostRequests();
  } else if (req.method === 'DELETE') {
    metrics.incrementDeleteRequests();
  }

  next();
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
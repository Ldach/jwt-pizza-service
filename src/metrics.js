const MetricBuilder = require('metric-builder');
const config = require('../config.js'); 

let requestMetrics = {
  GET: 0,
  POST: 0,
  PUT: 0,
  DELETE: 0,
  total_requests: 0,
};

function trackRequest(req, res, next) {
  const method = req.method;
  if (method === 'GET' || method === 'POST' || method === 'PUT' || method === 'DELETE') {
    requestMetrics[method]++;
  }
  requestMetrics.total_requests++;
  next();
}

function sendMetricsToGrafana(metrics) {
  console.log('Sending metrics to Grafana:', metrics);
}

function sendMetricsPeriodically(period) {
  setInterval(() => {
    try {
      const buf = new MetricBuilder();
      
      buf.addMetric('http_requests', requestMetrics.GET, 'method=GET');
      buf.addMetric('http_requests', requestMetrics.POST, 'method=POST');
      buf.addMetric('http_requests', requestMetrics.PUT, 'method=PUT');
      buf.addMetric('http_requests', requestMetrics.DELETE, 'method=DELETE');
      buf.addMetric('http_requests', requestMetrics.total_requests, 'method=total_requests');

      const metrics = buf.toString('\n');
      sendMetricsToGrafana(metrics);
    } catch (error) {
      console.log('Error sending metrics', error);
    }
  }, period);
}

module.exports = { trackRequest, sendMetricsPeriodically };

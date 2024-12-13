const config = require('./config.js');
const fetch = require('node-fetch');

class Metrics {
  constructor() {
    this.totalRequests = 0;
    this.totalGetRequests = 0;
    this.totalPostRequests = 0;
    this.totalPutRequests = 0;
    this.totalDeleteRequests = 0;

    const timer = setInterval(() => {
      this.sendMetricToGrafana('request', 'all', 'total', this.totalRequests);
      this.sendMetricToGrafana('request', 'get', 'total', this.totalGetRequests);
      this.sendMetricToGrafana('request', 'post', 'total', this.totalPostRequests);
      this.sendMetricToGrafana('request', 'put', 'total', this.totalPutRequests);
      this.sendMetricToGrafana('request', 'delete', 'total', this.totalDeleteRequests);
    }, 10000);
    timer.unref();
  }

  incrementRequests() {
    this.totalRequests++;
  }

  incrementGetRequests() {
    this.totalGetRequests++;
  }

  incrementPostRequests() {
    this.totalPostRequests++;
  }

  incrementPutRequests() {
    this.totalPutRequests++;
  }

  incrementDeleteRequests() {
    this.totalDeleteRequests++;
  }

  sendMetricToGrafana(metricPrefix, httpMethod, metricName, metricValue) {
    const metric = `${metricPrefix},source=${config.source},method=${httpMethod} ${metricName}=${metricValue}`;
    fetch(`${config.url}`, {
      method: 'POST',
      body: metric,
      headers: { Authorization: `Bearer ${config.userId}:${config.apiKey}` },
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Failed to push metrics data to Grafana');
        } else {
          console.log(`Pushed ${metric}`);
        }
      })
      .catch((error) => {
        console.error('Error pushing metrics:', error);
      });
  }
}

const metrics = new Metrics();
module.exports = metrics;

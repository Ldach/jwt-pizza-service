
const config = require('./config.js');


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
    const metric = `${metricPrefix},source=${metricsConfig.source},method=${httpMethod} ${metricName}=${metricValue}`;
    fetch(`${metricsConfig.url}`, {
      method: 'POST',
      body: metric,
      headers: { Authorization: `Bearer ${metricsConfig.userId}:${metricsConfig.apiKey}` },
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

/*
require('dotenv').config({ path: './var.env' });

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
    const grafanaUrl = process.env.GRAFANA_URL;
    const source = process.env.METRIC_SOURCE;
    const userId = process.env.GRAFANA_USER_ID;
    const apiKey = process.env.GRAFANA_API_KEY;

    if (!grafanaUrl || !source || !userId || !apiKey) {
      console.error('Missing environment variables for Grafana metrics.');
      return;
    }

    const metric = `${metricPrefix},source=${source},method=${httpMethod} ${metricName}=${metricValue}`;
    fetch(grafanaUrl, {
      method: 'POST',
      body: metric,
      headers: { Authorization: `Bearer ${userId}:${apiKey}` },
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
*/

const config = require('./config.js');


class Metrics {
  constructor() {
    this.totalRequests = 0;
    this.totalGetRequests = 0;
    this.totalPostRequests = 0;
    this.totalPutRequests = 0;
    this.totalDeleteRequests = 0;

    this.totalActiveUsers = 0;

    this.totalGoodAuthAttempt = 0;
    this.totalBadAuthAttempt = 0;

    this.CpuUsage = 0;
    this.MemoryUsage = 0;

    this.totalPizzasSold = 0;
    this.totalPizzasFailed = 0;
    this.totalRevenue = 0;

    this.serviceLatency = 0;
    this.pizzaLatency = 0;

    const timer = setInterval(() => {
      this.sendMetricToGrafana('request', 'all', 'total', this.totalRequests);
      this.sendMetricToGrafana('request', 'get', 'total', this.totalGetRequests);
      this.sendMetricToGrafana('request', 'post', 'total', this.totalPostRequests);
      this.sendMetricToGrafana('request', 'put', 'total', this.totalPutRequests);
      this.sendMetricToGrafana('request', 'delete', 'total', this.totalDeleteRequests);

      this.sendMetricToGrafana('current', 'active_users', 'users', this.totalActiveUsers);

      this.sendMetricToGrafana('auth', 'success', 'attempt', this.totalGoodAuthAttempt);
      this.sendMetricToGrafana('auth', 'failed', 'attempt', this.totalBadAuthAttempt);

      this.sendMetricToGrafana('live', 'CPU', 'usage', this.totalCpuUsage);
      this.sendMetricToGrafana('live', 'memory', 'usage', this.MemoryUsage);

      this.sendMetricToGrafana('total', 'sold', 'pizzas', this.totalPizzasSold);
      this.sendMetricToGrafana('total', 'failed', 'pizzas', this.totalPizzasFailed);
      this.sendMetricToGrafana('total', 'revenue', 'revenue', this.totalRevenue);

      this.sendMetricToGrafana('ongoing', 'service', 'latency', this.serviceLatency);
      this.sendMetricToGrafana('ongoing', 'pizza', 'latency', this.pizzaLatency);
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

  incrementActiveUsers() {
    this.totalActiveUsers++;
  }
  decrementActiveUsers() {
    this.totalActiveUsers--;
  }

  incrementGoodAuth() {
    this.totalGoodAuthAttempt++;
  }
  incrementBadAuth() {
    this.totalBadAuthAttempt++;
  }

  getCpuUsage(amount) {
    this.CpuUsage = amount;
  }
  getMemoryUsage(amount) {
    this.MemoryUsage = amount;
  }

  incrementPizzasSold() {
    this.totalPizzasSold++;
  }
  incrementPizzasFailed() {
    this.totalPizzasFailed++;
  }

  increaseRevenue(amount) {
    this.totalRevenue += amount;
  }

  getServiceLatency(amount) {
    this.serviceLatency = amount;
  }

  getPizzaLatency(amount){
    this.pizzaLatency = amount;
  }

  sendMetricToGrafana(metricPrefix, httpMethod, metricName, metricValue) {
    const { metrics } = config;
    const metric = `${metricPrefix},source=${metrics.source},method=${httpMethod} ${metricName}=${metricValue}`;
    fetch(`${metrics.url}`, {
      method: 'POST',
      body: metric,
      headers: { Authorization: `Bearer ${metrics.userId}:${metrics.apiKey}` },
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

//
// Imports
//
const schedule = require('node-schedule');
const Koa = require('koa');
const _ = require('koa-route');

const SpeedTest = require('./speed-test');
const promFormatter = require('./prom-formatter');

//
// Locals
//
let testResults = null;

const app = new Koa();

//
// Functoins
//
const routes = {
  metrics: async ctx => {
    console.log('/metrics');

    ctx.type = 'text/plain; version=0.0.4';

    if (testResults) {
      ctx.body = promFormatter.format(testResults);
    }
  }
};

async function runSpeedTest() {
  let test = new SpeedTest();

  await test.run().then(v => {
    testResults = v;

    console.log('speedtest: ', v);
  }).catch(e => {
    console.error('error: ', e);
  });
}

//
// Runtime
//
app.use(_.get('/metrics/', routes.metrics));

app.listen(9696);

schedule.scheduleJob((process.env.CRONTAB || '* * * * *'), runSpeedTest);

runSpeedTest();

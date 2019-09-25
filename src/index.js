const schedule = require('node-schedule');
const speedTest = require('speedtest-net');
const toPromise = require('event-to-promise');

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------

let format = (results) => {
  if(!results) return ''
  
  let output = '';
  const lb = '\n';

  output += `# TYPE speedtest_megabits_per_second gauge${lb}`;
  output += `# HELP speedtest_megabits_per_second Speed measured in megabits per second${lb}`;
  output += `speedtest_megabits_per_second{direction="downstream"} ${results.speeds.download}${lb}`;
  output += `speedtest_megabits_per_second{direction="upstream"} ${results.speeds.upload}${lb}`;

  output += `# TYPE speedtest_ping gauge${lb}`;
  output += `# HELP speedtest_ping Ping in ms${lb}`;
  output += `speedtest_ping ${results.server.ping}${lb}`;

  return output;
}

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------

var status = undefined

let test = () => speedTest({
  proxy: process.env.PROXY,
  maxTime: process.env.MAX_TIME,
  pingCount: process.env.PING_COUNT,
  maxServers: process.env.MAX_SERVERS,
  serverId: process.env.SERVER_ID,
  serversUrl: process.env.SERVERS_URL
})
 
schedule.scheduleJob((process.env.CRONTAB || '* * * * *'), () => {
  toPromise(test(), 'data')
    .then(result => {
      console.log(result)
      return result
    })
    .then(result => { status = result })
});

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------

const express = require('express')
const app = express()

app.use(require('cors')())

app.get('/metrics', (req, res) => {
  console.log('GET /metrics');
  res.type('text/plain; version=0.0.4').send(format(status))
})

app.listen(9696, () => console.log(`App listening on port 9696`))
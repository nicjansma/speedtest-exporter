const speedTest = require('speedtest-net');
const toPromise = require('event-to-promise');

let test = () => speedTest({
  maxTime: process.env.MAX_TIME,
  serverId: process.env.SERVER_ID //"7839"
})

let format = (results) => {
  let output = '';
  const lb = '\n';

  output += `# TYPE speedtest_bits_per_second gauge${lb}`;
  output += `# HELP speedtest_bits_per_second Speed measured against speedtest.net in megabits per seconds${lb}`;
  output += `speedtest_bits_per_second{direction="downstream"} ${results.speeds.download}${lb}`;
  output += `speedtest_bits_per_second{direction="upstream"} ${results.speeds.upload}${lb}`;

  output += `# TYPE speedtest_ping gauge${lb}`;
  output += `# HELP speedtest_ping Ping in ms${lb}`;
  output += `speedtest_ping ${results.server.ping}${lb}`;

  return output;
}

let controller = (req, res) => {
  console.log('GET /metrics');

  return toPromise(test(), 'data')
  
    .then(result => {
      console.log({ download: result.speeds.download, upload: result.speeds.upload, ping: result.server.ping })
      console.log(result)
      return result
    })
    
    .then(format)
    .then(result => res.type('text/plain; version=0.0.4').send(result))
    
    .catch(e => {
      console.log('e', e);
    });
}

const express = require('express')
const app = express()

app.use(require('cors')())

app.get('/metrics', controller)

app.listen(9696, () => console.log(`App listening on port 9696`))

const speedTestNet = require('speedtest-net');

class SpeedTest {

  async run() {

    let options = {
      proxy: process.env.PROXY,
      maxTime: process.env.MAX_TIME,
      pingCount: process.env.PING_COUNT,
      maxServers: process.env.MAX_SERVERS,
      serverId: process.env.SERVER_ID,
      serversUrl: process.env.SERVERS_URL,
      acceptLicense: true,
      acceptGdpr: true
    };

    console.log('running test', options);

    const result = await speedTestNet(options);

    return {
      speeds: {
        download: (result.download.bandwidth / 125000).toFixed(2),
        upload: (result.upload.bandwidth / 125000).toFixed(2)
      },
      server: {
        ping: result.ping.latency.toFixed(2)
      }
    };
  }
}

module.exports = SpeedTest;

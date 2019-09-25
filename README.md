# SPEEDTEST exporter

Prometheus exporter for network speedtests. It is built on the [speedtest-net](https://www.npmjs.com/package/speedtest-net) library.

## Configurations

It is possible to use environment variables in order to configure the exporter.

* `CRONTAB` - the crontab code for test frequency definition (https://crontab.guru)
* `PROXY` - the proxy for upload or download, support http and https (example : "http://proxy:3128")
* `MAX_TIME` - the maximum length (in ms) of a single test run (upload or download)
* `PING_COUNT` - the number of close servers to ping to find the fastest one
* `MAX_SERVERS` - the number of servers to run a download test on. The fastest is used for the upload test and the fastest result is reported at the end.
* `SERVER_ID` - ID of the server to restrict the tests against.
* `SERVERS_URL` - URL to obtain the list of servers available for speed test. (default: http://www.speedtest.net/speedtest-servers-static.php)

## Metrics

Metrics are exposed at port `9696`.
The following is an example of the exposed metrics.

```
# TYPE speedtest_megabits_per_second gauge
# HELP speedtest_megabits_per_second Speed measured in megabits per second
speedtest_megabits_per_second{direction="downstream"} 123.401
speedtest_megabits_per_second{direction="upstream"} 120.216
# TYPE speedtest_ping gauge
# HELP speedtest_ping Ping in ms
speedtest_ping 16.4
```

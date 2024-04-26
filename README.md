[![pages-build-deployment](https://github.com/rviscomi/ismyhostfastyet/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/rviscomi/ismyhostfastyet/actions/workflows/pages/pages-build-deployment)

# Is my host fast yet?

Using web transparency data from the Chrome UX Report and HTTP Archive, this project aims to benchmark hosting providers using real user data. The metric used in this project is TTFB, the time to first byte.

## Methodology

This is still a work in progress, but for an in depth methodology of a WordPress-specific version of this study, see http://bit.ly/ttfb-crux-wp.

## Contribute

If you'd like to add a new host, you'll need to do three things:

1. Determine its HTTP header fingerprint, for example `X-Powered-By: YourHost`
2. Submit a PR to update [ttfb.sql](ttfb.sql) with your new host's metadata
3. Run `ttfb.sql` on [BigQuery](https://cloud.google.com/bigquery/) and update [ttfb.json](ttfb.json) with the results

List of available datasets:

* [chrome-ux-report](https://console.cloud.google.com/bigquery?p=chrome-ux-report&d=materialized&page=dataset)
* [httparchive](https://console.cloud.google.com/bigquery?p=httparchive&d=summary_requests&page=dataset)

# Update these two subqueries monthly.
WITH crux AS (
  SELECT
    *
  FROM
    `chrome-ux-report.materialized.device_summary`
  WHERE
    date = '2022-07-01'
), requests AS (
  SELECT
    _TABLE_SUFFIX,
    *
  FROM
    `httparchive.summary_requests.2022_07_01_*`
)

SELECT DISTINCT
  CASE
   WHEN platform = 'hostinger' THEN 'Hostinger'
   WHEN platform = 'zoneos' THEN 'Zone.eu'
   WHEN platform = 'seravo' THEN 'Seravo'
   WHEN platform = 'automattic.com/jobs' THEN 'Automattic'
   WHEN platform = 'wpvip.com/careers' THEN 'Automattic'
   WHEN platform = 'wordpress.com' THEN 'Automattic'
   WHEN platform = 'x-ah-environment' THEN 'Acquia'
   WHEN platform = 'x-pantheon-styx-hostname' THEN 'Pantheon'
   WHEN platform = 'wpe-backend' THEN 'WP Engine'
   WHEN platform = 'wp engine' THEN 'WP Engine'
   WHEN platform = 'x-kinsta-cache' THEN 'Kinsta'
   WHEN platform = 'hubspot' THEN 'HubSpot'
   WHEN platform = 'b7440e60b07ee7b8044761568fab26e8' THEN 'SiteGround'
   WHEN platform = '624d5be7be38418a3e2a818cc8b7029b' THEN 'SiteGround'
   WHEN platform = '6b7412fb82ca5edfd0917e3957f05d89' THEN 'SiteGround'
   WHEN platform = 'x-github-request' THEN 'GitHub'
   WHEN platform = 'alproxy' THEN 'AlwaysData'
   WHEN platform = 'netlify' THEN 'Netlify'
   WHEN platform = 'x-lw-cache' THEN 'Liquid Web'
   WHEN platform = 'squarespace' THEN 'Squarespace'
   WHEN platform = 'x-wix-request-id' THEN 'Wix'
   WHEN platform = 'x-shopify-stage' THEN 'Shopify'
   WHEN platform = 'x-vercel-id' THEN 'Vercel'
   WHEN platform = 'flywheel' THEN 'Flywheel'
   WHEN platform = 'weebly' THEN 'Weebly'
   WHEN platform = 'dps/' THEN 'GoDaddy Website Builder'
   ELSE NULL
  END AS platform,
  client,
  COUNT(DISTINCT url) AS n,
  COUNT(DISTINCT IF(ttfb = 'Good', url, NULL)) / COUNT(DISTINCT url) AS fast,
  COUNT(DISTINCT IF(ttfb = 'Needs Improvement', url, NULL)) / COUNT(DISTINCT url) AS avg,
  COUNT(DISTINCT IF(ttfb = 'Poor', url, NULL)) / COUNT(DISTINCT url) AS slow
FROM (
  SELECT
    IF(device = 'desktop', 'desktop', 'mobile') AS client,
    CONCAT(origin, '/') AS url,
    CASE
      WHEN SAFE_DIVIDE(fast_ttfb, (fast_ttfb + avg_ttfb + slow_ttfb)) >= 0.75 THEN 'Good'
      WHEN SAFE_DIVIDE(slow_ttfb, (fast_ttfb + avg_ttfb + slow_ttfb)) >= 0.25 THEN 'Poor'
      WHEN fast_ttfb IS NOT NULL THEN 'Needs Improvement'
      ELSE NULL
    END AS ttfb
  FROM
    crux
  WHERE
    device IN ('desktop', 'phone') AND
    fast_ttfb IS NOT NULL)
JOIN (
  SELECT
    _TABLE_SUFFIX AS client,
    url,
    REGEXP_EXTRACT(LOWER(CONCAT(IFNULL(respOtherHeaders, ''), IFNULL(resp_x_powered_by, ''), IFNULL(resp_via, ''), IFNULL(resp_server, ''))),
      r'(zoneos|seravo|x-kinsta-cache|automattic.com/jobs|wpvip.com/careers|wordpress\.com|x-ah-environment|x-pantheon-styx-hostname|wpe-backend|wp engine|hubspot|b7440e60b07ee7b8044761568fab26e8|624d5be7be38418a3e2a818cc8b7029b|6b7412fb82ca5edfd0917e3957f05d89|x-github-request|alproxy|netlify|x-lw-cache|squarespace|x-wix-request-id|x-shopify-stage|x-vercel-id|flywheel|weebly|dps/|hostinger)') AS platform
  FROM
    requests
  WHERE
    firstHtml)
USING
  (client, url)
WHERE
  platform IS NOT NULL
GROUP BY
  platform,
  client
ORDER BY
  fast DESC

#standardSQL
SELECT
  CASE
   WHEN platform = 'seravo' THEN 'Seravo'
   WHEN platform = 'automattic.com/jobs' THEN 'Automattic'
   WHEN platform = 'wpvip.com/careers' THEN 'Automattic'
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
  COUNT(DISTINCT origin) AS n,
  SUM(IF(ttfb.start < 200, ttfb.density, 0)) / SUM(ttfb.density) AS fast,
  SUM(IF(ttfb.start >= 200 AND ttfb.start < 1000, ttfb.density, 0)) / SUM(ttfb.density) AS avg,
  SUM(IF(ttfb.start >= 1000, ttfb.density, 0)) / SUM(ttfb.density) AS slow
FROM
  `chrome-ux-report.all.202004`,
  UNNEST(experimental.time_to_first_byte.histogram.bin) AS ttfb
JOIN
  (SELECT _TABLE_SUFFIX AS client, url, REGEXP_EXTRACT(LOWER(CONCAT(respOtherHeaders, resp_x_powered_by, resp_via, resp_server)),
      '(seravo|x-kinsta-cache|automattic.com/jobs|wpvip.com/careers|x-ah-environment|x-pantheon-styx-hostname|wpe-backend|wp engine|hubspot|b7440e60b07ee7b8044761568fab26e8|624d5be7be38418a3e2a818cc8b7029b|6b7412fb82ca5edfd0917e3957f05d89|x-github-request|alproxy|netlify|x-lw-cache|squarespace|x-wix-request-id|x-shopify-stage|x-vercel-id|flywheel|weebly|dps/)')
    AS platform
  FROM `httparchive.summary_requests.2020_04_01_*`
  WHERE firstHtml)
ON
  client = IF(form_factor.name = 'desktop', 'desktop', 'mobile') AND
  CONCAT(origin, '/') = url
WHERE
  platform IS NOT NULL
GROUP BY
  platform,
  client
ORDER BY
  n DESC

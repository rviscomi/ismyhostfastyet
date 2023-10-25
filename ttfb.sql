# Update this monthly.
DECLARE QUERY_DATE DATE DEFAULT '2023-09-01';

# Add/edit platforms in alphabetical order here.
DECLARE PLATFORMS ARRAY<STRUCT<regex STRING, name STRING>> DEFAULT [
  ('awex', '000webhost'),
  ('x-ah-environment', 'Acquia'),
  ('alproxy', 'AlwaysData'),
  ('automattic.com/work-with-us', 'Automattic'),
  ('wpvip.com/careers', 'Automattic'),
  ('wordpress.com', 'Automattic'),
  ('a9130478a60e5f9135f765b23f26593b', 'Automattic'),
  ('flywheel', 'Flywheel'),
  ('x-github-request', 'GitHub'),
  ('dps/', 'GoDaddy Website Builder'),
  ('hostinger', 'Hostinger'),
  ('zyro.com', 'Hostinger Website Builder'),
  ('hubspot', 'HubSpot'),
  ('x-kinsta-cache', 'Kinsta'),
  ('x-lw-cache', 'Liquid Web'),
  ('netlify', 'Netlify'),
  ('x-pantheon-styx-hostname', 'Pantheon'),
  ('seravo', 'Seravo'),
  ('x-shopify-stage', 'Shopify'),
  ('b7440e60b07ee7b8044761568fab26e8', 'SiteGround'),
  ('624d5be7be38418a3e2a818cc8b7029b', 'SiteGround'),
  ('6b7412fb82ca5edfd0917e3957f05d89', 'SiteGround'),
  ('squarespace', 'Squarespace'),
  ('x-vercel-id', 'Vercel'),
  ('weebly', 'Weebly'),
  ('x-wix-request-id', 'Wix'),
  ('wp-cloud', 'WP-Cloud'),
  ('wpe-backend', 'WP Engine'),
  ('wp engine', 'WP Engine'),
  ('wp engine atlas', 'WP Engine Atlas'),
  ('zoneos', 'Zone.eu')
];


WITH crux AS (
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
    `chrome-ux-report.materialized.device_summary`
  WHERE
    date = QUERY_DATE AND
    device IN ('desktop', 'phone') AND
    fast_ttfb IS NOT NULL
),

requests AS (
  SELECT
    client,
    root_page,
    JSON_VALUE(summary, '$.respOtherHeaders') AS respOtherHeaders,
    JSON_VALUE(summary, '$.resp_x_powered_by') AS resp_x_powered_by,
    JSON_VALUE(summary, '$.resp_via') AS resp_via,
    JSON_VALUE(summary, '$.resp_server') AS resp_server
  FROM
    `httparchive.all.requests`
  WHERE
    date = QUERY_DATE AND
    is_main_document
),

platform_regex AS (
  SELECT
    STRING_AGG(regex, r'|') AS pattern
  FROM
    UNNEST(PLATFORMS)
),

detected_platforms AS (
  SELECT
    client,
    url,
    name AS platform
  FROM
    UNNEST(PLATFORMS)
  JOIN (
    SELECT
      client,
      root_page AS url,
      REGEXP_EXTRACT(LOWER(CONCAT(IFNULL(respOtherHeaders, ''), IFNULL(resp_x_powered_by, ''), IFNULL(resp_via, ''), IFNULL(resp_server, ''))), (SELECT pattern FROM platform_regex)) AS regex
    FROM
      requests)
  USING
    (regex)
)


SELECT DISTINCT
  platform,
  client,
  COUNT(DISTINCT url) AS n,
  COUNT(DISTINCT IF(ttfb = 'Good', url, NULL)) / COUNT(DISTINCT url) AS fast,
  COUNT(DISTINCT IF(ttfb = 'Needs Improvement', url, NULL)) / COUNT(DISTINCT url) AS avg,
  COUNT(DISTINCT IF(ttfb = 'Poor', url, NULL)) / COUNT(DISTINCT url) AS slow
FROM
  detected_platforms
JOIN
  crux
USING
  (client, url)
GROUP BY
  platform,
  client
ORDER BY
  fast DESC

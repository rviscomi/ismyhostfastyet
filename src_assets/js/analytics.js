export const analytics = {
  // Full Measurement Protocol param reference:
  // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
  data: {
    v: "1", // Measurement Protocol version.
    tid: "UA-22381566-4", // Tracking ID.
    cid: `${Date.now()}${Math.random()}`, // Client ID.
    dl: location.href, // Document location.
    aip: "1", // Anonymize IP.

  },
  send(additionalParams) {
    navigator.sendBeacon(
      "https://google-analytics.com/collect",
      new URLSearchParams({
        ...this.data,
        ...additionalParams,
      }).toString()
    );
  },
};

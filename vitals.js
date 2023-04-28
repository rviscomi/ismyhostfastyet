import {
  onCLS,
  onFID,
  onLCP,
  onINP
} from 'https://unpkg.com/web-vitals@3/dist/web-vitals.attribution.js?module';

function sendToGoogleAnalytics({name, delta, value, id, rating, navigationType, attribution}) {
  const eventParams = {
    value: delta,
    metric_id: id,
    metric_value: value,
    metric_delta: delta,
    metric_rating: rating,
    navigation_type: navigationType
  };

  if (navigator.deviceMemory) {
    eventParams.debug_device_memory = navigator.deviceMemory;
  }

  switch (name) {
    case 'CLS':
      eventParams.debug_target = attribution.largestShiftTarget;
      eventParams.largest_shift_time = attribution.largestShiftTime;
      eventParams.largest_shift_score = attribution.largestShiftValue;
      break;
    case 'FID':
      eventParams.debug_target = attribution.eventTarget;
      eventParams.interaction_type = attribution.eventType;
      eventParams.interaction_time = Math.round(attribution.eventTime);
      break;
    case 'LCP':
      eventParams.debug_target = attribution.element;
      eventParams.time_to_first_byte = attribution.timeToFirstByte;
      eventParams.resource_load_time = attribution.resourceLoadTime;
      eventParams.resource_load_delay = attribution.resourceLoadDelay;
      eventParams.element_render_delay = attribution.elementRenderDelay;
      eventParams.scrollY = scrollY;
      break;
    case 'INP':
      eventParams.debug_target = attribution.eventTarget;
      eventParams.interaction_type = attribution.eventType;
      eventParams.interaction_time = Math.round(attribution.eventTime);
      if (!attribution.eventEntry) {
        break;
      }
      eventParams.interaction_delay = Math.round(attribution.eventEntry.processingStart - attribution.eventEntry.startTime);
      eventParams.processing_time = Math.round(attribution.eventEntry.processingEnd - attribution.eventEntry.processingStart);
      eventParams.presentation_delay =  Math.round(attribution.eventEntry.duration + attribution.eventEntry.startTime - attribution.eventEntry.processingEnd);
      break;
  }
  gtag('event', name, eventParams);
}

onCLS(sendToGoogleAnalytics);
onFID(sendToGoogleAnalytics);
onLCP(sendToGoogleAnalytics);
onINP(sendToGoogleAnalytics);

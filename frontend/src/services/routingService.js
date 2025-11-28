// src/services/routingService.js

// Convert meters → km with 2 decimals
const formatDistance = (meters) => {
  if (!meters && meters !== 0) return "-";
  return (meters / 1000).toFixed(2) + " km";
};

// Convert seconds → human-readable duration
const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return "-";
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours} hr ${remMins} min`;
};

// Extract route info from Leaflet Routing Machine route object
const extractRouteInfo = (route) => {
  if (!route || !route.summary) return null;

  const { totalDistance, totalTime } = route.summary;

  const steps = (route.instructions || []).map((inst, idx) => ({
    id: `${idx}-${inst.type}-${inst.distance}`,
    text: inst.text,
    distance: inst.distance,
    time: inst.time,
  }));

  return {
    distance: totalDistance,
    duration: totalTime,
    steps,
  };
};

export { formatDistance, formatDuration, extractRouteInfo };

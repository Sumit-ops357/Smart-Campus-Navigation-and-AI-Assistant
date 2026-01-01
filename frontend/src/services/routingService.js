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

// Map instruction modifier → arrow icon
const iconForModifier = (modifier) => {
  if (!modifier) return "➤";

  const m = modifier.toLowerCase();
  if (m.includes("straight") || m.includes("continue")) return "⬆️";
  if (m.includes("sharp left")) return "↙️";
  if (m.includes("sharp right")) return "↘️";
  if (m.includes("slight left")) return "↖️";
  if (m.includes("slight right")) return "↗️";
  if (m.includes("left")) return "⬅️";
  if (m.includes("right")) return "➡️";
  if (m.includes("uturn")) return "🔄";
  if (m.includes("roundabout")) return "⭕";

  return "➤";
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
    type: inst.type,
    modifier: inst.modifier,
    icon: iconForModifier(inst.modifier),
  }));

  return {
    distance: totalDistance,
    duration: totalTime,
    steps,
  };
};

export { formatDistance, formatDuration, extractRouteInfo };

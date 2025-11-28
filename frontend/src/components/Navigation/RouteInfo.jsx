// src/components/Navigation/RouteInfo.jsx

import React from "react";
import { formatDistance, formatDuration } from "../../services/routingService";

const RouteInfo = ({ routeInfo, onClear }) => {
  if (!routeInfo) {
    return (
      <div className="route-info route-info-empty">
        <p>Select a start and end location on the map to see the route.</p>
      </div>
    );
  }

  const { distance, duration, steps } = routeInfo;

  return (
    <div className="route-info">
      <div className="route-info-header">
        <h3>Route Details</h3>
        <button className="route-clear-btn" onClick={onClear}>
          Clear Route
        </button>
      </div>

      <div className="route-summary">
        <div>
          <strong>Distance:</strong> {formatDistance(distance)}
        </div>
        <div>
          <strong>Time:</strong> {formatDuration(duration)}
        </div>
      </div>

      <div className="route-steps">
        <h4>Turn-by-turn directions</h4>
        {steps && steps.length > 0 ? (
          <ol>
            {steps.map((step) => (
              <li key={step.id}>{step.text}</li>
            ))}
          </ol>
        ) : (
          <p>No detailed instructions available.</p>
        )}
      </div>
    </div>
  );
};

export default RouteInfo;

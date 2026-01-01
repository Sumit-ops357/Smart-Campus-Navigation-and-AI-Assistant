// src/components/Navigation/RouteInfo.jsx

import React, { useState } from "react";
import {
  formatDistance,
  formatDuration,
} from "../../services/routingService";
import { searchLocations } from "../../data/campusLocations";

const RouteInfo = ({
  routeInfo,
  onClear,
  onManualRoute,
  startLocation,
  endLocation,
  routeError,
}) => {
  const [startText, setStartText] = useState("");
  const [endText, setEndText] = useState("");
  const [useMyLocation, setUseMyLocation] = useState(false);

  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onManualRoute) return;

    onManualRoute({
      startName: startText,
      endName: endText,
      useMyLocation,
    });
  };

  // ---- Autocomplete handlers ----
  const handleStartChange = (value) => {
    setStartText(value);

    if (!value.trim()) {
      setStartSuggestions([]);
      return;
    }

    const matches = searchLocations(value).slice(0, 6);
    setStartSuggestions(matches);
  };

  const handleEndChange = (value) => {
    setEndText(value);

    if (!value.trim()) {
      setEndSuggestions([]);
      return;
    }

    const matches = searchLocations(value).slice(0, 6);
    setEndSuggestions(matches);
  };

  const pickStartSuggestion = (loc) => {
    setStartText(loc.name);
    setStartSuggestions([]);
  };

  const pickEndSuggestion = (loc) => {
    setEndText(loc.name);
    setEndSuggestions([]);
  };

  const hasRoute = !!routeInfo;
  const distance = routeInfo?.distance;
  const duration = routeInfo?.duration;
  const steps = routeInfo?.steps || [];

  return (
    <div className="route-info">
      {/* Google-maps style form */}
      <form className="route-search-form" onSubmit={handleSubmit}>
        <div className="route-fields">
          {/* Start field */}
          <div className="route-field">
            <label className="route-label">Start</label>
            <div className="route-input-wrapper">
              <input
                type="text"
                placeholder={
                  startLocation
                    ? startLocation.name
                    : "Type start or tap on map"
                }
                value={startText}
                onChange={(e) => handleStartChange(e.target.value)}
              />
              {startSuggestions.length > 0 && (
                <ul className="route-suggestions">
                  {startSuggestions.map((loc) => (
                    <li
                      key={loc.id}
                      onClick={() => pickStartSuggestion(loc)}
                    >
                      <span className="route-suggestion-name">
                        {loc.name}
                      </span>
                      <span className="route-suggestion-meta">
                        {loc.building}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Destination field */}
          <div className="route-field">
            <label className="route-label">Destination</label>
            <div className="route-input-wrapper">
              <input
                type="text"
                placeholder={
                  endLocation
                    ? endLocation.name
                    : "Type campus destination"
                }
                value={endText}
                onChange={(e) => handleEndChange(e.target.value)}
              />
              {endSuggestions.length > 0 && (
                <ul className="route-suggestions">
                  {endSuggestions.map((loc) => (
                    <li
                      key={loc.id}
                      onClick={() => pickEndSuggestion(loc)}
                    >
                      <span className="route-suggestion-name">
                        {loc.name}
                      </span>
                      <span className="route-suggestion-meta">
                        {loc.building}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="route-actions">
          <label className="route-my-location">
            <input
              type="checkbox"
              checked={useMyLocation}
              onChange={(e) => setUseMyLocation(e.target.checked)}
            />
            Use my current location as start
          </label>

          <div className="route-buttons">
            <button type="submit" className="auth-btn route-get-btn">
              Get Directions
            </button>

            {hasRoute && (
              <button
                type="button"
                className="route-clear-btn"
                onClick={onClear}
              >
                Clear Route
              </button>
            )}
          </div>
        </div>
      </form>

      {routeError && <p className="auth-error">{routeError}</p>}

      {hasRoute ? (
        <>
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
            {steps.length > 0 ? (
              <ol>
                {steps.map((step) => (
                  <li key={step.id}>
                    <span className="route-step-icon">
                      {step.icon || "➤"}
                    </span>
                    <span>{step.text}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p>No detailed instructions available.</p>
            )}
          </div>
        </>
      ) : (
        <div className="route-info-empty">
          <p>
            Select start & end on the map, or type them above, then click{" "}
            <strong>Get Directions</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteInfo;

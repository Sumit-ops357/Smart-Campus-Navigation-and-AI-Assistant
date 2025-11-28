// src/components/Map/RouteDisplay.jsx

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { extractRouteInfo } from "../../services/routingService";

// --- DEV CLEANUP: filter noisy "Routing error" logs from Leaflet Routing Machine ---
if (!console._routingPatchedForRouting) {
  const originalConsoleError = console.error;

  console.error = function (...args) {
    if (
      args[0] &&
      typeof args[0] === "string" &&
      args[0].startsWith("Routing error:")
    ) {
      return; // swallow this specific log
    }
    return originalConsoleError.apply(console, args);
  };

  console._routingPatchedForRouting = true;
}
// --- END DEV CLEANUP ---

/* ...rest of your existing RouteDisplay code (patches + component) ... */

/**
 * PATCH leaflet-routing-machine internal methods
 * to avoid noisy console errors like:
 *  - "Cannot read properties of null (reading 'removeLayer')"
 *  - "Cannot read properties of null (reading 'addLayer')"
 *
 * These happen when async routing callbacks fire after the
 * map/control has already been removed by React.
 *
 * We also patch _handleError so it does NOT call console.error.
 */
if (L.Routing) {
  // Patch Line._clearLines
  if (L.Routing.Line && !L.Routing.Line.prototype._patchedClearLines) {
    const originalClearLines = L.Routing.Line.prototype._clearLines;

    L.Routing.Line.prototype._clearLines = function () {
      if (!this._map) return; // map already gone → skip
      return originalClearLines.call(this);
    };

    L.Routing.Line.prototype._patchedClearLines = true;
  }

  // Patch Line._addLayer (where _map.addLayer(...) is called)
  if (L.Routing.Line && !L.Routing.Line.prototype._patchedAddLayer) {
    const originalAddLayer = L.Routing.Line.prototype._addLayer;

    L.Routing.Line.prototype._addLayer = function (layer) {
      if (!this._map) return; // map already gone → skip
      return originalAddLayer.call(this, layer);
    };

    L.Routing.Line.prototype._patchedAddLayer = true;
  }

  // Patch Control._clearLines (some versions use this)
  if (
    L.Routing.Control &&
    L.Routing.Control.prototype &&
    !L.Routing.Control.prototype._patchedClearLines
  ) {
    const originalCtrlClearLines = L.Routing.Control.prototype._clearLines;

    if (originalCtrlClearLines) {
      L.Routing.Control.prototype._clearLines = function () {
        if (!this._line || !this._line._map) return;
        return originalCtrlClearLines.call(this);
      };
    }

    L.Routing.Control.prototype._patchedClearLines = true;
  }

  // Patch Control._handleError so it doesn't spam console.error
  if (
    L.Routing.Control &&
    L.Routing.Control.prototype &&
    !L.Routing.Control.prototype._patchedHandleError
  ) {
    // We simply swallow the error; UI already handles failures gracefully.
    L.Routing.Control.prototype._handleError = function () {
      // no-op: prevent default console.error("Routing error", ...)
    };

    L.Routing.Control.prototype._patchedHandleError = true;
  }
}
// --- END PATCH ---

const RouteDisplay = ({ start, end, onRouteChange }) => {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Remove previous routing control when start/end change
    if (controlRef.current) {
      map.removeControl(controlRef.current);
      controlRef.current = null;
    }

    if (!start || !end) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false, // hide default panel
      lineOptions: {
        addWaypoints: false,
        extendToWaypoints: true,
        missingRouteTolerance: 10,
      },
    })
      .on("routesfound", (e) => {
        const [route] = e.routes;
        const info = extractRouteInfo(route);
        if (onRouteChange) onRouteChange(info);
      })
      .addTo(map);

    controlRef.current = control;

    // Cleanup when component unmounts or deps change
    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [map, start, end, onRouteChange]);

  return null;
};

export default RouteDisplay;

// src/components/Map/RouteDisplay.jsx

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine"; // for L.Routing.osrmv1
import { extractRouteInfo } from "../../services/routingService";

const RouteDisplay = ({ start, end, onRouteChange }) => {
  const map = useMap();
  const lineRef = useRef(null);
  const xhrRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    let cancelled = false;

    // remove old line
    if (lineRef.current) {
      map.removeLayer(lineRef.current);
      lineRef.current = null;
    }

    if (!start || !end) {
      if (onRouteChange) onRouteChange(null);
      return;
    }

    const router = L.Routing.osrmv1({
      serviceUrl: "https://router.project-osrm.org/route/v1",
    });

    const waypoints = [
      L.Routing.waypoint(L.latLng(start.lat, start.lng)),
      L.Routing.waypoint(L.latLng(end.lat, end.lng)),
    ];

    const xhr = router.route(waypoints, (err, routes) => {
      if (cancelled) return;

      if (err || !routes || !routes.length) {
        console.error("Routing error:", err);
        if (onRouteChange) onRouteChange(null);
        return;
      }

      const route = routes[0];

      if (lineRef.current) {
        map.removeLayer(lineRef.current);
        lineRef.current = null;
      }

      const latlngs = route.coordinates.map((c) =>
        L.latLng(c.lat, c.lng)
      );

      // 🔵 Blue route line
      const polyline = L.polyline(latlngs, {
        color: "#1d4ed8",
        weight: 7,
        opacity: 0.95,
      }).addTo(map);

      lineRef.current = polyline;

      const info = extractRouteInfo(route);
      if (onRouteChange) onRouteChange(info);
    });

    xhrRef.current = xhr;

    return () => {
      cancelled = true;

      if (xhrRef.current && typeof xhrRef.current.abort === "function") {
        try {
          xhrRef.current.abort();
        } catch {
          // ignore
        }
      }

      if (lineRef.current) {
        map.removeLayer(lineRef.current);
        lineRef.current = null;
      }
    };
  }, [map, start?.lat, start?.lng, end?.lat, end?.lng, onRouteChange]);

  return null;
};

export default RouteDisplay;

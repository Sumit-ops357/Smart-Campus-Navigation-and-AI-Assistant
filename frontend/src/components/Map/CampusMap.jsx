// src/components/Map/CampusMap.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  campusLocations,
  campusCenter,
  categoryColors,
  getLocationByName,
} from "../../data/campusLocations";
import LocationPopup from "./LocationPopup";
import RouteDisplay from "./RouteDisplay";
import RouteInfo from "../Navigation/RouteInfo";
import UserLocationTracker from "./UserLocationTracker";
import { useRoute } from "../../context/RouteContext";
import "../../styles/map.css";

// Fix Leaflet default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle map view changes from sidebar selection
const MapViewController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 17, {
        animate: true,
        duration: 1,
      });
    }
  }, [center, zoom, map]);

  return null;
};

const CampusMap = ({ selectedLocation, onMarkerClick }) => {
  const {
    startLocation,
    endLocation,
    setStartLocation,
    setEndLocation,
    routeInfo,
    setRouteInfo,
    routeError,
    setRouteError,
    clearRoute,
  } = useRoute();

  const [isUsingUserLocation, setIsUsingUserLocation] = useState(false);
  const [userCoords, setUserCoords] = useState(null);

  const mapRef = useRef(null);
  const markerRefs = useRef({}); // keep refs to markers

  // Create custom icon based on category
  const createCustomIcon = (location) => {
    const color = categoryColors[location.category] || "#33808d";

    return L.divIcon({
      className: "custom-marker-icon",
      html: `
        <div class="marker-container" style="background-color: ${color}">
          <span class="marker-emoji">${location.icon}</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  // marker click: 1st → start, 2nd → end, 3rd → new start
  const handleMarkerClick = (location) => {
    setRouteError("");
    setIsUsingUserLocation(false);

    if (!startLocation) {
      setStartLocation(location);
      setEndLocation(null);
      setRouteInfo(null);
    } else if (!endLocation) {
      setEndLocation(location);
    } else {
      setStartLocation(location);
      setEndLocation(null);
      setRouteInfo(null);
    }

    if (onMarkerClick) {
      onMarkerClick(location);
    }
  };

  // Called by RouteInfo when user submits form
  const handleManualRoute = ({ startName, endName, useMyLocation }) => {
    setRouteError("");
    setRouteInfo(null);

    let start = startLocation;
    let end = endLocation;

    // --- Start (source) ---
    if (useMyLocation) {
      setIsUsingUserLocation(true);

      if (!userCoords) {
        setRouteError(
          "Still getting your current location… please wait a moment."
        );
        return;
      }

      const userStart = {
        id: "user-location",
        name: "My current location",
        category: "User",
        icon: "📍",
        coordinates: userCoords,
      };

      start = userStart;
      setStartLocation(userStart);
    } else {
      setIsUsingUserLocation(false);

      const trimmed = startName?.trim();
      if (trimmed) {
        const src = getLocationByName(trimmed);
        if (!src) {
          setRouteError(`Start location "${trimmed}" was not found on campus.`);
          return;
        }
        start = src;
        setStartLocation(src);
      } else if (!startLocation) {
        setRouteError(
          "Please enter a start location or choose one on the map."
        );
        return;
      }
    }

    // --- Destination ---
    const destTrim = endName?.trim();
    if (destTrim) {
      const dest = getLocationByName(destTrim);
      if (!dest) {
        setRouteError(
          `Destination "${destTrim}" was not found on campus.`
        );
        return;
      }
      end = dest;
      setEndLocation(dest);
    } else if (!endLocation) {
      setRouteError("Please enter a destination.");
      return;
    }

    // RouteDisplay will recompute when startLocation / endLocation updates
  };

  // Live GPS tracking – update userCoords & dynamic start when needed
  const handleUserMove = (pos) => {
    const [lat, lng] = pos;
    const coords = { lat, lng };
    setUserCoords(coords);

    if (isUsingUserLocation && startLocation?.id === "user-location") {
      setStartLocation((prev) =>
        prev
          ? {
            ...prev,
            coordinates: coords,
          }
          : prev
      );
    }
  };

  // When a location is selected from the list, open its popup
  useEffect(() => {
    if (!selectedLocation) return;
    // We now use a central Modal in App.jsx, so we might NOT want to open the small popup automatically.
    // Commenting this out to prevent double-visual (Popup + Modal).
    /*
    const ref = markerRefs.current[selectedLocation.id];
    if (ref && ref.openPopup) {
      ref.openPopup();
    }
    */
  }, [selectedLocation]);

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[campusCenter.lat, campusCenter.lng]}
        zoom={campusCenter.zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        {/* Base map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Live GPS tracker & marker – ONLY when using current location */}
        {isUsingUserLocation && (
          <UserLocationTracker onMove={handleUserMove} />
        )}

        {/* Campus markers */}
        {campusLocations.map((location) => (
          <Marker
            key={location.id}
            position={[
              location.coordinates.lat,
              location.coordinates.lng,
            ]}
            icon={createCustomIcon(location)}
            eventHandlers={{
              click: () => handleMarkerClick(location),
            }}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[location.id] = ref;
              }
            }}
          >
            <Popup maxWidth={300} className="location-popup">
              <LocationPopup location={location} />
            </Popup>
          </Marker>
        ))}

        {/* External focus from search list */}
        {selectedLocation && (
          <MapViewController
            center={[
              selectedLocation.coordinates.lat,
              selectedLocation.coordinates.lng,
            ]}
            zoom={17}
          />
        )}

        {/* Blue route line */}
        {startLocation && endLocation && (
          <RouteDisplay
            start={{
              lat: startLocation.coordinates.lat,
              lng: startLocation.coordinates.lng,
            }}
            end={{
              lat: endLocation.coordinates.lat,
              lng: endLocation.coordinates.lng,
            }}
            onRouteChange={setRouteInfo}
          />
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-title">CATEGORIES</div>
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: color }}
            />
            <span>{category}</span>
          </div>
        ))}
      </div>

      {/* Route info panel */}
      <div className="route-info-container">
        <div className="route-info-status">
          <div>
            <strong>Start:</strong>{" "}
            {startLocation ? startLocation.name : "-"}
          </div>
          <div>
            <strong>End:</strong>{" "}
            {endLocation ? endLocation.name : "-"}
          </div>
        </div>

        <RouteInfo
          routeInfo={routeInfo}
          onClear={clearRoute}
          onManualRoute={handleManualRoute}
          startLocation={startLocation}
          endLocation={endLocation}
          routeError={routeError}
        />
      </div>
    </div>
  );
};

export default CampusMap;

// src/components/Map/CampusMap.jsx

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { campusLocations, campusCenter, categoryColors } from '../../data/campusLocations';
import LocationPopup from './LocationPopup';
import '../../styles/map.css';

// Fix Leaflet default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map view changes
const MapViewController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 17, {
        animate: true,
        duration: 1
      });
    }
  }, [center, zoom, map]);
  
  return null;
};

const CampusMap = ({ selectedLocation, onMarkerClick }) => {
  const [setActiveMarker] = useState(null);
  const mapRef = useRef(null);

  // Create custom icon based on category
  const createCustomIcon = (location) => {
    const color = categoryColors[location.category] || '#33808d';
    
    return L.divIcon({
      className: 'custom-marker-icon',
      html: `
        <div class="marker-container" style="background-color: ${color}">
          <span class="marker-emoji">${location.icon}</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  const handleMarkerClick = (location) => {
    setActiveMarker(location.id);
    if (onMarkerClick) {
      onMarkerClick(location);
    }
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[campusCenter.lat, campusCenter.lng]}
        zoom={campusCenter.zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Render all location markers */}
        {campusLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.coordinates.lat, location.coordinates.lng]}
            icon={createCustomIcon(location)}
            eventHandlers={{
              click: () => handleMarkerClick(location)
            }}
          >
            <Popup maxWidth={300} className="location-popup">
              <LocationPopup location={location} />
            </Popup>
          </Marker>
        ))}

        {/* Handle external view changes */}
        {selectedLocation && (
          <MapViewController
            center={[
              selectedLocation.coordinates.lat,
              selectedLocation.coordinates.lng
            ]}
            zoom={17}
          />
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-title">Categories</div>
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
    </div>
  );
};

export default CampusMap;

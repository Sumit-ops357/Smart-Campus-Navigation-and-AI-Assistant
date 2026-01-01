// src/components/Map/LocationPopup.jsx

import React from 'react';
import './LocationPopup.css';

const LocationPopup = ({ location }) => {
  return (
    <div className="location-popup-content">
      {/* Location Image */}
      {location.imageUrl && (
        <div className="popup-image-container">
          <img
            src={location.imageUrl}
            alt={location.name}
            className="popup-image"
            onError={(e) => {
              e.target.style.display = 'none'; // Hide if broken
            }}
          />
        </div>
      )}

      {/* Header with Icon and Name */}
      <div className="popup-header">
        <span className="popup-icon">{location.icon}</span>
        <h3 className="popup-title">{location.name}</h3>
      </div>

      {/* Location Details */}
      <div className="popup-details">
        <div className="popup-detail-item">
          <span className="detail-label">📍 Building:</span>
          <span className="detail-value">{location.building}</span>
        </div>

        {location.floor && (
          <div className="popup-detail-item">
            <span className="detail-label">🏢 Floor:</span>
            <span className="detail-value">{location.floor}</span>
          </div>
        )}

        <div className="popup-detail-item">
          <span className="detail-label">⏰ Hours:</span>
          <span className="detail-value">{location.openingHours}</span>
        </div>

        {location.capacity && (
          <div className="popup-detail-item">
            <span className="detail-label">👥 Capacity:</span>
            <span className="detail-value">{location.capacity} people</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="popup-description">{location.description}</p>

      {/* Amenities */}
      {location.amenities && location.amenities.length > 0 && (
        <div className="popup-amenities">
          <div className="amenities-title">✨ Amenities:</div>
          <div className="amenities-list">
            {location.amenities.map((amenity, index) => (
              <span key={index} className="amenity-tag">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Category Badge */}
      <div className="popup-footer">
        <span className={`category-badge badge-${location.category.toLowerCase()}`}>
          {location.category}
        </span>
      </div>
    </div>
  );
};

export default LocationPopup;

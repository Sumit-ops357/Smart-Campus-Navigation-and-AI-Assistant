// src/components/Map/LocationDetailModal.jsx

import React from "react";
import "./LocationDetailModal.css";

const LocationDetailModal = ({ location, onClose }) => {
    if (!location) return null;

    return (
        <div className="loc-modal-overlay" onClick={onClose}>
            <div className="loc-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="loc-modal-close" onClick={onClose}>
                    &times;
                </button>

                {/* Content Split: Image Left (or Top), Details Right */}
                <div className="loc-modal-content">
                    {/* Image Section */}
                    <div className="loc-modal-image-wrapper">
                        {location.imageUrl ? (
                            <img
                                src={location.imageUrl}
                                alt={location.name}
                                className="loc-modal-image"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        ) : (
                            <div className="loc-modal-placeholder-image">
                                <span>{location.icon}</span>
                            </div>
                        )}
                        <div className={`loc-modal-badge badge-${location.category.toLowerCase()}`}>
                            {location.category}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="loc-modal-info">
                        <h2 className="loc-modal-title">{location.name}</h2>

                        {/* Key Details Grid */}
                        <div className="loc-modal-meta-grid">
                            <div className="loc-meta-item">
                                <span className="loc-meta-label">Building</span>
                                <span className="loc-meta-value">{location.building}</span>
                            </div>
                            {location.floor && (
                                <div className="loc-meta-item">
                                    <span className="loc-meta-label">Floor</span>
                                    <span className="loc-meta-value">{location.floor}</span>
                                </div>
                            )}
                            <div className="loc-meta-item">
                                <span className="loc-meta-label">Hours</span>
                                <span className="loc-meta-value loc-highlight">{location.openingHours}</span>
                            </div>
                            <div className="loc-meta-item">
                                <span className="loc-meta-label">Status</span>
                                <span className="loc-meta-value">Open Now</span>
                            </div>
                        </div>

                        <h4 className="loc-section-header">Description</h4>
                        <p className="loc-modal-description">{location.description}</p>

                        {location.amenities && location.amenities.length > 0 && (
                            <>
                                <h4 className="loc-section-header">Amenities & Features</h4>
                                <div className="loc-modal-tags">
                                    {location.amenities.map((amenity, idx) => (
                                        <span key={idx} className="loc-modal-tag">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Action Buttons */}
                        <div className="loc-modal-actions">
                            <button className="loc-btn-primary" onClick={onClose}>
                                View on Map
                            </button>
                            {/* Future: Add 'Directions' button here if needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationDetailModal;

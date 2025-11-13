// src/App.jsx

import { useState } from 'react';
import CampusMap from './components/Map/CampusMap';
import SearchBar from './components/Navigation/SearchBar';
import LocationList from './components/Navigation/LocationList';
import './App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">🗺️ Smart Campus Navigator</h1>
          <p className="header-subtitle">Find your way around campus easily</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="app-main">
        {/* Sidebar with Search and Location List */}
        <aside className="app-sidebar">
          <div className="sidebar-content">
            <h2 className="sidebar-title">Campus Locations</h2>
            <p className="sidebar-note">
              🕵️‍♂️ Search any building or facility, or click a location to zoom the map!
            </p>
            <SearchBar onSelect={handleLocationSelect} />

            <LocationList
              activeId={selectedLocation ? selectedLocation.id : null}
              onSelect={handleLocationSelect}
            />

            {/* Selected Location Info */}
            {selectedLocation && (
              <div className="selected-location-info">
                <h3>Selected Location</h3>
                <div className="location-details-card">
                  <div className="location-header">
                    <span className="location-icon-large">
                      {selectedLocation.icon}
                    </span>
                    <div>
                      <h4>{selectedLocation.name}</h4>
                      <p className="location-category">
                        {selectedLocation.category}
                      </p>
                    </div>
                  </div>
                  <p className="location-description">
                    {selectedLocation.description}
                  </p>
                  <div className="location-meta">
                    <div className="meta-item">
                      <span className="meta-label">Building:</span>
                      <span className="meta-value">
                        {selectedLocation.building}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Hours:</span>
                      <span className="meta-value">
                        {selectedLocation.openingHours}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Map Container */}
        <main className="app-map-container">
          <CampusMap
            selectedLocation={selectedLocation}
            onMarkerClick={handleMarkerClick}
          />
        </main>
      </div>
    </div>
  );
}

export default App;

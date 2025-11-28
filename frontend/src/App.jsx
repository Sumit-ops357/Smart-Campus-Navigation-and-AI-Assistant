// src/App.jsx

import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import CampusMap from "./components/Map/CampusMap";
import SearchBar from "./components/Navigation/SearchBar";
import LocationList from "./components/Navigation/LocationList";
import ChatInterface from "./components/AI/ChatInterface";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import { campusLocations as staticLocations } from "./data/campusLocations";
import { fetchLocations } from "./services/locationService";

// ✅ Part 9 components
import SmartSuggestions from "./components/Recommendations/SmartSuggestions";
import PopularSpots from "./components/Recommendations/PopularSpots";

function App() {
  const [locations, setLocations] = useState(staticLocations);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);

  const { user, logout } = useAuth();

  // load locations from backend (Part 6)
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const apiLocations = await fetchLocations();
        if (Array.isArray(apiLocations) && apiLocations.length > 0) {
          setLocations(apiLocations);
        }
      } catch (err) {
        console.error("Failed to load locations from backend:", err);
        setError("Could not load live locations. Showing built-in campus data.");
      }
    };

    loadLocations();
  }, []);

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const activeId =
    selectedLocation ? selectedLocation.id || selectedLocation._id : null;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">🗺️ Smart Campus Navigator</h1>
          <p className="header-subtitle">Find your way around campus easily</p>
        </div>

        {/* Auth area */}
        <div className="header-auth">
          {user ? (
            <>
              <span className="header-user">Hi, {user.name}</span>
              <button className="header-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-btn">
                Login
              </Link>
              <Link to="/register" className="header-btn header-btn-outline">
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-main">
              {/* Sidebar */}
              <aside className="app-sidebar">
                <div className="sidebar-content">
                  <h2 className="sidebar-title">Campus Locations</h2>
                  <p className="sidebar-note">
                    🕵️‍♂️ Search any building or facility, or click a location to
                    zoom the map!
                  </p>

                  {error && <p className="sidebar-error">{error}</p>}

                  <SearchBar
                    locations={locations}
                    onSelect={handleLocationSelect}
                  />

                  <LocationList
                    locations={locations}
                    activeId={activeId}
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

                  {/* ⭐ Part 9 widgets – always visible */}
                  <SmartSuggestions />
                  <PopularSpots />
                </div>
              </aside>

              {/* Map + Chat */}
              <main className="app-map-container">
                <CampusMap
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onMarkerClick={handleMarkerClick}
                />

                <ChatInterface
                  locations={locations}
                  onNavigateToLocation={handleLocationSelect}
                />
              </main>
            </div>
          }
        />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;

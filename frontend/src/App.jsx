// src/App.jsx

import { useEffect, useState } from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import CampusMap from "./components/Map/CampusMap";
import SearchBar from "./components/Navigation/SearchBar";
import LocationList from "./components/Navigation/LocationList";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import { campusLocations as staticLocations } from "./data/campusLocations";
import { fetchLocations } from "./services/locationService";
import EventsPage from "./components/Events/EventsPage";
import RecommendationPage from "./components/Recommendations/RecommendationPage";
import ChatPage from "./components/AI/ChatPage";
import SportsPage from "./components/Sports/SportsPage";

function App() {
  const [locations, setLocations] = useState(staticLocations);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);

  const { user, logout } = useAuth();

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
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">🗺️ Smart Campus Navigator</h1>
          <p className="header-subtitle">Find your way around campus easily</p>
        </div>

        <nav className="header-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "header-nav-link" + (isActive ? " header-nav-link--active" : "")
            }
          >
            Map
          </NavLink>

          <NavLink
            to="/recommendations"
            className={({ isActive }) =>
              "header-nav-link" + (isActive ? " header-nav-link--active" : "")
            }
          >
            Recommendations
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) =>
              "header-nav-link" + (isActive ? " header-nav-link--active" : "")
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/ai"
            className={({ isActive }) =>
              "header-nav-link" + (isActive ? " header-nav-link--active" : "")
            }
          >
            AI Assistant
          </NavLink>

          <NavLink
            to="/sports"
            className={({ isActive }) =>
              "header-nav-link" + (isActive ? " header-nav-link--active" : "")
            }
          >
            Sports
          </NavLink>
        </nav>

        <div className="header-auth">
          {user ? (
            <>
              <span className="header-user">Hi, {user.name}</span>
              <button
                className="header-btn header-btn-outline"
                onClick={logout}
              >
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

      <Routes>
        <Route
          path="/"
          element={
            <div className="app-main">
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

              <main className="app-map-container">
                <CampusMap
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onMarkerClick={handleMarkerClick}
                />
              </main>
            </div>
          }
        />

        <Route path="/recommendations" element={<RecommendationPage />} />

        <Route
          path="/events"
          element={
            <EventsPage
              onGoToLocation={(locId, locName) => {
                const found =
                  locations.find((l) => l._id === locId) ||
                  locations.find((l) => l.name === locName);
                if (found) {
                  setSelectedLocation(found);
                }
              }}
            />
          }
        />

        <Route path="/ai" element={<ChatPage />} />

        <Route path="/sports" element={<SportsPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;

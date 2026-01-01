import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CampusMap from "../components/Map/CampusMap";
import SearchBar from "../components/Navigation/SearchBar";
import LocationList from "../components/Navigation/LocationList";
import ChatInterface from "../components/AI/ChatInterface";
import { useAuth } from "../context/AuthContext";
import { campusLocations as staticLocations } from "../data/campusLocations";
import { fetchLocations } from "../services/locationService";
import SmartSuggestions from "../components/Recommendations/SmartSuggestions";
import PopularSpots from "../components/Recommendations/PopularSpots";
import mainBuilding from "../assets/main_building.jpg";
import csBuilding from "../assets/cs_building.jpg";
import electricalBuilding from "../assets/electrical_building.jpg";
import mechanicalBuilding from "../assets/mechanical_building.jpg";
import electronicsBuilding from "../assets/electronics_building.jpg";

const MapPage = () => {
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
    <div className="app-main-container">
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

      <div className="app-main">
        {/* Sidebar */}
        <aside className="app-sidebar">
          <div className="sidebar-content">
            <h2 className="sidebar-title">Campus Locations</h2>
            <p className="sidebar-note">
              🕵️‍♂️ Search any building or facility, or click a location to zoom the
              map!
            </p>

            {error && <p className="sidebar-error">{error}</p>}

            <SearchBar locations={locations} onSelect={handleLocationSelect} />

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

            {/* Widgets */}
            <SmartSuggestions />
            <PopularSpots />

            {/* Campus Highlights */}
            <div className="campus-highlights">
              <h3 className="sidebar-title" style={{ fontSize: "16px", marginTop: "20px" }}>Campus Highlights</h3>
              <div className="highlights-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <img src={mainBuilding} alt="Main" style={{ width: "100%", borderRadius: "8px", height: "80px", objectFit: "cover" }} />
                <img src={csBuilding} alt="CS" style={{ width: "100%", borderRadius: "8px", height: "80px", objectFit: "cover" }} />
                <img src={electricalBuilding} alt="Electrical" style={{ width: "100%", borderRadius: "8px", height: "80px", objectFit: "cover" }} />
                <img src={mechanicalBuilding} alt="Mechanical" style={{ width: "100%", borderRadius: "8px", height: "80px", objectFit: "cover" }} />
                <img src={electronicsBuilding} alt="Electronics" style={{ width: "100%", borderRadius: "8px", height: "80px", objectFit: "cover" }} />
              </div>
            </div>
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
    </div>
  );
};

export default MapPage;

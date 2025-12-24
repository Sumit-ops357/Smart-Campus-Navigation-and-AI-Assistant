import { useEffect, useState } from "react";
import { fetchEvents } from "../../services/eventService";
import "../../styles/events.css";

export default function EventsPage({ onGoToLocation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events", err);
        setError("Could not load events right now.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="events-page">
      <div className="events-container">
        <h1 className="events-title">Campus Events</h1>
        <p className="events-subtitle">
          Explore upcoming activities, workshops, and sports on campus
        </p>

        <section className="events-section">
          {loading && <p>Loading events...</p>}
          {error && <p className="events-error">{error}</p>}

          {!loading && !error && events.length === 0 && (
            <div className="events-empty-card">
              <p>No events found. Check back later!</p>
            </div>
          )}

          <div className="events-list">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="event-card"
                onClick={() => setSelectedEvent(ev)}
              >
                {ev.imageUrl ? (
                  <img
                    className="event-image"
                    src={
                      ev.imageUrl.startsWith("http")
                        ? ev.imageUrl
                        : `${import.meta.env.VITE_API_URL}${ev.imageUrl}`
                    }
                    alt={ev.title}
                  />
                ) : (
                  <div className="event-image" style={{ background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                    No Image
                  </div>
                )}

                <div className="event-card-content">
                  <div className="event-category-badge">
                    {ev.category || "Event"}
                  </div>
                  <h3 className="event-title">{ev.title}</h3>
                  <div className="event-description-preview">
                    {ev.description}
                  </div>
                  
                  <div className="event-card-footer">
                    <div className="event-location-row">
                       📍 {ev.locationName}
                    </div>
                    {ev.startTime && (
                      <div className="event-time-row">
                         {new Date(ev.startTime).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DETAIL MODAL */}
          {selectedEvent && (
            <div className="event-detail-overlay" onClick={() => setSelectedEvent(null)}>
              <div 
                className="event-detail-modal"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
              >
                <div 
                  className="event-detail-close-btn"
                  onClick={() => setSelectedEvent(null)}
                >
                  ✕
                </div>

                <div className="event-detail-body">
                  <div className="event-detail-image-wrapper">
                    {selectedEvent.imageUrl && (
                       <img
                       className="event-detail-image-full"
                       src={
                         selectedEvent.imageUrl.startsWith("http")
                           ? selectedEvent.imageUrl
                           : `${import.meta.env.VITE_API_URL}${selectedEvent.imageUrl}`
                       }
                       alt={selectedEvent.title}
                     />
                    )}
                  </div>

                  <div className="event-detail-content">
                    <div className="event-detail-category">
                      {selectedEvent.category}
                    </div>
                    <h2 className="event-detail-title">{selectedEvent.title}</h2>
                    
                    <div className="event-detail-meta">
                      <div className="event-meta-item">
                        <span className="event-meta-label">Date:</span>
                        <span className="event-meta-value">
                          {new Date(selectedEvent.startTime).toLocaleString()}
                        </span>
                      </div>
                      <div className="event-meta-item">
                        <span className="event-meta-label">Location:</span>
                        <span className="event-meta-value">
                          {selectedEvent.locationName}
                          {selectedEvent.building && ` (${selectedEvent.building})`}
                        </span>
                      </div>
                    </div>

                    <p className="event-detail-desc">
                      {selectedEvent.description}
                    </p>

                    <button 
                      className="event-cta-btn"
                      onClick={() => {
                        // If user wants to locate this on map, we can call onGoToLocation if provided
                        if (onGoToLocation) {
                             onGoToLocation(selectedEvent.locationId || null, selectedEvent.locationName);
                             // Need to handle navigation to map page presumably? 
                             // For now just close or let parent handle routing if structured that way.
                             // But EventsPage is just a page.
                        }
                        setSelectedEvent(null);
                      }}
                    >
                      Locate on Map
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

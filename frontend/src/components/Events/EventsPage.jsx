import { useEffect, useState } from "react";
import { fetchEvents, rsvpEvent, createEvent, fetchPendingEvents, approveEvent } from "../../services/eventService";
import { useAuth } from "../../context/AuthContext";
import { useRoute } from "../../context/RouteContext";
import { useNavigate } from "react-router-dom";
import "../../styles/events.css";

const CATEGORIES = ["All", "Workshop", "Sports", "Cultural", "Tech", "Social"];

export default function EventsPage({ onGoToLocation }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  const { user, token } = useAuth();
  const { setEndLocation, setStartLocation } = useRoute();
  const navigate = useNavigate();

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    category: "Workshop",
    startTime: "",
    endTime: "",
    locationName: "",
    organizer: "",
  });

  useEffect(() => {
    loadEvents();
  }, [user]);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(ev => ev.category === activeCategory));
    }
  }, [activeCategory, events]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      console.error("Failed to load events", err);
      setError("Could not load events right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
// ... (rest same until handleCreateEvent)
    if (!user) {
      alert("Please login to RSVP for events!");
      return;
    }
    try {
      const result = await rsvpEvent(eventId, token);
      // Update local state
      setEvents(prev => prev.map(ev => 
        ev._id === eventId ? { ...ev, rsvpCount: result.rsvpCount } : ev
      ));
      if (selectedEvent && selectedEvent._id === eventId) {
        setSelectedEvent(prev => ({ ...prev, rsvpCount: result.rsvpCount }));
      }
    } catch (err) {
      alert("Failed to RSVP. Please try again.");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newEvent).forEach(key => formData.append(key, newEvent[key]));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createEvent(formData, token);
      alert(user?.isAdmin ? "Event created!" : "Event submitted! It will appear once approved by an admin.");
      setShowCreateModal(false);
      setImageFile(null);
      setNewEvent({
        title: "",
        description: "",
        category: "Workshop",
        startTime: "",
        endTime: "",
        locationName: "",
        organizer: "",
      });
      loadEvents();
      if (user?.isAdmin) loadPendingEvents();
    } catch (err) {
      alert("Failed to submit event.");
    }
  };

  const handleApprove = async (eventId) => {
    try {
      await approveEvent(eventId, token);
      alert("Event approved!");
      loadPendingEvents();
      loadEvents();
    } catch (err) {
      alert("Failed to approve event.");
    }
  };

  const handleLocateAndRoute = (event) => {
    setEndLocation({
      id: event.locationId,
      name: event.locationName,
      coordinates: event.coordinates || null,
    });
    setStartLocation({
      id: "user-location",
      name: "My current location",
      category: "User",
      icon: "📍",
    });
    navigate("/");
  };

  const getGoogleCalendarUrl = (event) => {
    const start = new Date(event.startTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(event.endTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.locationName);
    const title = encodeURIComponent(event.title);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  return (
    <div className="events-page">
      <div className="events-hero">
        <div className="hero-content">
          <h1 className="events-title">Discover Campus Life</h1>
          <p className="events-subtitle">
            Stay updated with workshops, sports, and cultural festivals happening around you.
          </p>
          <div className="hero-actions">
             <button className="btn-primary" onClick={() => setShowCreateModal(true)}>Host an Event</button>
             <button className="btn-outline" onClick={() => navigate("/")}>View on Map</button>
          </div>
        </div>
      </div>

      <div className="events-container">
        <div className="filter-bar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <section className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
          {loading && (
            <div className="events-loading">
              <div className="spinner"></div>
              <p>Fetching amazing events for you...</p>
            </div>
          )}
          {error && <p className="events-error">{error}</p>}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="events-empty-card">
              <p>No events found for "{activeCategory}". Try another category!</p>
            </div>
          )}

          <div className="events-list">
            {filteredEvents.map((ev) => (
              <div
                key={ev._id}
                className="event-card premium"
                onClick={() => setSelectedEvent(ev)}
              >
                <div className="event-badge">{ev.category || "General"}</div>
                {ev.imageUrl ? (
                  <img
                    className="event-image"
                      src={
                        ev.imageUrl.startsWith("http")
                          ? ev.imageUrl
                          : `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}${ev.imageUrl}`
                      }
                    alt={ev.title}
                  />
                ) : (
                  <div className="event-image-placeholder">
                    <span>📅</span>
                  </div>
                )}

                <div className="event-card-content">
                  <h3 className="event-title">{ev.title}</h3>
                  <div className="event-meta-simple">
                      <span>📍 {ev.locationName}</span>
                      <span>⏰ {new Date(ev.startTime).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="event-card-hover-actions">
                      <button className="rsvp-mini-btn" onClick={(e) => {
                        e.stopPropagation();
                        handleRSVP(ev._id);
                      }}>
                        {ev.rsvpCount || 0} Interested
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* DETAIL MODAL */}
      {selectedEvent && (
        <div className="event-detail-overlay" onClick={() => setSelectedEvent(null)}>
          <div 
            className="event-detail-modal premium"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>

            <div className="modal-body">
              <div className="modal-sidebar">
                {selectedEvent.imageUrl ? (
                   <img src={selectedEvent.imageUrl.startsWith("http") ? selectedEvent.imageUrl : `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}${selectedEvent.imageUrl}`} alt={selectedEvent.title} />
                ) : (
                  <div className="modal-image-placeholder">📅</div>
                )}
                <div className="rsvp-stats">
                   <strong>{selectedEvent.rsvpCount || 0}</strong> people are interested
                </div>
                <button className="rsvp-main-btn" onClick={() => handleRSVP(selectedEvent._id)}>
                  I'm Interested
                </button>
              </div>

              <div className="modal-main-content">
                <span className="modal-category">{selectedEvent.category}</span>
                <h2 className="modal-title">{selectedEvent.title}</h2>
                <div className="modal-info-grid">
                  <div className="info-item">
                    <label>When</label>
                    <p>{new Date(selectedEvent.startTime).toLocaleString()}</p>
                  </div>
                  <div className="info-item">
                    <label>Where</label>
                    <p>{selectedEvent.locationName}</p>
                  </div>
                  <div className="info-item">
                    <label>Organizer</label>
                    <p>{selectedEvent.organizer || "Campus Admin"}</p>
                  </div>
                </div>

                <div className="modal-description">
                  <h3>About the Event</h3>
                  <p>{selectedEvent.description}</p>
                </div>

                <div className="modal-footer-actions">
                  <button className="btn-route" onClick={() => handleLocateAndRoute(selectedEvent)}>
                    🚀 Navigate to Event
                  </button>
                  <a 
                    className="btn-calendar" 
                    href={getGoogleCalendarUrl(selectedEvent)} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    📅 Add to Calendar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="event-detail-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="event-detail-modal create-modal premium" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            <div className="create-modal-content">
              <h2>Host a New Event</h2>
              <p>Share your event with the campus community!</p>
              
              <form onSubmit={handleCreateEvent}>
                <div className="form-group">
                  <label>Event Title</label>
                  <input required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="e.g. Annual Hackathon" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})}>
                      {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input required value={newEvent.locationName} onChange={e => setNewEvent({...newEvent, locationName: e.target.value})} placeholder="e.g. Science Block A" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input required type="datetime-local" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>End Time</label>
                    <input required type="datetime-local" value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Event Image</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                  <p className="form-help">Upload a photo to make your event stand out.</p>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="4" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="What's the event about?"></textarea>
                </div>
                <button type="submit" className="btn-primary full-width">
                  {user?.isAdmin ? "Create Now" : "Submit for Approval"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

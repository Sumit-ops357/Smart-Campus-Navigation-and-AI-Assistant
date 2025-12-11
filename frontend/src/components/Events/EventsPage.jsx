import { useEffect, useState } from "react";
import { fetchEvents } from "../../services/eventService";
import "../../styles/events.css";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // NEW

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
      <h1 className="events-title">Campus Events &amp; Activities</h1>
      <p className="events-subtitle">
        Discover what&apos;s happening on campus this week.
      </p>

      <section className="events-section">
        <h2 className="events-section-title">Upcoming Events</h2>

        {loading && <p>Loading events…</p>}
        {error && <p className="events-error">{error}</p>}

        {!loading && !error && events.length === 0 && (
          <div className="events-empty-card">
            <p>No events right now. Try adding some via Postman.</p>
          </div>
        )}

        <div className="events-list">
          {events.map((ev) => (
            <article
              key={ev._id}
              className="event-card event-card-clickable"   // NEW class
              onClick={() => setSelectedEvent(ev)}          // NEW
            >
              {ev.imageUrl && (
                <img
                  className="event-image"
                  src={
                    ev.imageUrl.startsWith("http")
                      ? ev.imageUrl
                      : `${import.meta.env.VITE_API_URL}${ev.imageUrl}`
                  }
                  alt={ev.title}
                />
              )}

              <div className="event-header">
                <span className="event-category">{ev.category}</span>
                <h3 className="event-title">{ev.title}</h3>
              </div>

              <p className="event-description">{ev.description}</p>

              <div className="event-meta">
                <div>
                  <span>{ev.locationName}</span>
                </div>
                <div>
                  <span>
                    {new Date(ev.startTime).toLocaleString()}{" "}
                    {ev.endTime &&
                      " - " + new Date(ev.endTime).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {selectedEvent && (
          <div className="event-detail">
            <h3>{selectedEvent.title}</h3>
            {selectedEvent.imageUrl && (
              <img
                className="event-detail-image"
                src={
                  selectedEvent.imageUrl.startsWith("http")
                    ? selectedEvent.imageUrl
                    : `${import.meta.env.VITE_API_URL}${selectedEvent.imageUrl}`
                }
                alt={selectedEvent.title}
              />
            )}
            <p className="event-description">{selectedEvent.description}</p>
            <p className="event-meta-line">
              <strong>Location:</strong> {selectedEvent.locationName}
              {selectedEvent.building && ` (${selectedEvent.building})`}
            </p>
            <p className="event-meta-line">
              <strong>Time:</strong>{" "}
              {new Date(selectedEvent.startTime).toLocaleString()} –{" "}
              {selectedEvent.endTime &&
                new Date(selectedEvent.endTime).toLocaleString()}
            </p>
            <button
              type="button"
              className="event-detail-close"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { fetchPopularSpots } from "../../services/recommendationService";
import "../../styles/recommendations.css";

export default function PopularSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPopularSpots();
        if (data && data.length > 0) {
          setSpots(data);
        } else {
          // MOCK DATA
          setSpots([
            {
              id: 'p1',
              name: 'Main Auditorium',
              category: 'Event Hall',
              imageUrl: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg?auto=compress&cs=tinysrgb&w=600',
              visits: 120,
              description: 'Hosting the annual tech symposium.'
            },
            {
              id: 'p2',
              name: 'Coffee House',
              category: 'Cafeteria',
              imageUrl: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=600',
              visits: 85,
              description: 'Best cappuccino on campus.'
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to load popular spots", err);
        setSpots([
          {
            id: 'p1',
            name: 'Main Auditorium',
            category: 'Event Hall',
            imageUrl: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg?auto=compress&cs=tinysrgb&w=600',
            visits: 120,
            description: 'Hosting the annual tech symposium.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section>
      <div className="rec-section-title">
        <span>🔥</span> Trending Spots
      </div>

      {loading && <p className="rec-empty">Loading trending spots...</p>}

      {!loading && spots.length === 0 && (
        <div className="rec-empty">
          No data yet. Start exploring the campus!
        </div>
      )}

      <div className="rec-card-grid">
        {spots.map((loc, index) => (
          <div
            key={loc.id || loc._id || index}
            className="rec-card-item"
            onClick={() => setSelected(loc)}
          >
            {loc.imageUrl ? (
              <img
                src={loc.imageUrl}
                alt={loc.name}
                className="rec-card-image"
              />
            ) : (
              <div className="rec-card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No Image</div>
            )}

            <div className="rec-card-content">
              <span className="rec-card-badge badge-popular">
                #{index + 1} Trending
              </span>
              <h4 className="rec-card-title">{loc.name}</h4>
              <p className="rec-card-desc">
                {loc.category} • Heavily visited this week.
              </p>

              {loc.visits && (
                <div className="rec-card-footer">
                  👥 {loc.visits} visits recently
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="rec-overlay" onClick={() => setSelected(null)}>
          <div className="rec-modal" onClick={(e) => e.stopPropagation()}>
            {selected.imageUrl && (
              <img
                src={selected.imageUrl}
                alt={selected.name}
                className="rec-modal-image"
              />
            )}
            <div className="rec-modal-content">
              <h3 className="rec-modal-title">{selected.name}</h3>
              <p className="rec-modal-text">
                {selected.description || "One of the most popular places on campus right now."}
              </p>
              <p><strong>Category:</strong> {selected.category}</p>
              <p><strong>Visits:</strong> {selected.visits}</p>
            </div>
            <button className="rec-close-btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

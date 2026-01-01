import { useEffect, useState } from "react";
import { fetchPopularSpots } from "../../services/recommendationService";
import LocationDetailModal from "../Map/LocationDetailModal";
import "../../styles/recommendations.css";

export default function PopularSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // For now, using static data as requested to show Sports Arena and BT Auditorium
    // const load = async () => {
    //   try {
    //     const data = await fetchPopularSpots();
    //     if (data && data.length > 0) {
    //       setSpots(data);
    //     }
    //   } catch (err) {
    //     console.error("Failed to load popular spots", err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // load();

    // Direct static data
    setSpots([
      {
        id: 'p1',
        name: 'BT Auditorium',
        category: 'Event Hall',
        imageUrl: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg?auto=compress&cs=tinysrgb&w=600',
        visits: 120,
        description: 'Hosting the annual tech symposium.',
        openingHours: '8:00 AM - 8:00 PM',
        building: 'Auditorium',
        floor: 'Ground'
      },
      {
        id: 'p2',
        name: 'Sports Arena',
        category: 'Sports',
        imageUrl: 'https://images.pexels.com/photos/2202685/pexels-photo-2202685.jpeg?auto=compress&cs=tinysrgb&w=600',
        visits: 95,
        description: 'Indoor facility for badminton, table tennis, and gym.',
        openingHours: '6:00 AM - 9:00 PM',
        building: 'Sports Complex',
        floor: 'Ground',
        amenities: ["Badminton", "Gym", "Table Tennis"]
      }
    ]);
    setLoading(false);
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
              <div className="rec-card-image rec-card-placeholder">
                <span>📍</span>
              </div>
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
        <LocationDetailModal
          location={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}

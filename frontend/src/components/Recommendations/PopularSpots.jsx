import { useEffect, useState } from "react";
import { fetchPopularSpots } from "../../services/recommendationService";
import "../../styles/recommendations.css";

export default function PopularSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // NEW

  useEffect(() => {
    const load = async () => {
      const data = await fetchPopularSpots();
      setSpots(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="rec-card">
      <h3 className="rec-title">🔥 Popular Spots</h3>

      {loading && <p className="rec-muted">Loading popular places…</p>}

      {!loading && spots.length === 0 && (
        <p className="rec-muted">
          No popularity data yet. Start exploring the campus!
        </p>
      )}

      <ul className="rec-list">
        {spots.map((loc, index) => (
          <li
            key={loc.id || loc._id || index}
            className="rec-item rec-item-clickable"
            onClick={() => setSelected(loc)}           // NEW
          >
            {loc.imageUrl && (
              <img
                src={loc.imageUrl}
                alt={loc.name}
                className="rec-image"
              />
            )}

            <div className="rec-item-header">
              <span className="rec-rank">#{index + 1}</span>
              <span className="rec-name">{loc.name}</span>
            </div>
            {loc.category && (
              <p className="rec-time">Category: {loc.category}</p>
            )}
            {loc.visits && (
              <p className="rec-reason">{loc.visits} visits</p>
            )}
          </li>
        ))}
      </ul>

      {selected && (
        <div className="rec-detail">
          <h4 className="rec-detail-title">
            {selected.title || selected.name}
          </h4>
          {selected.imageUrl && (
            <img
              src={selected.imageUrl}
              alt={selected.title || selected.name}
              className="rec-image"
            />
          )}
          {selected.description && (
            <p className="rec-reason">{selected.description}</p>
          )}
          {selected.locationName && (
            <p className="rec-time">
              {selected.locationName}
              {selected.building && ` (${selected.building})`}
            </p>
          )}
          <button
            type="button"
            className="rec-detail-close"
            onClick={() => setSelected(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

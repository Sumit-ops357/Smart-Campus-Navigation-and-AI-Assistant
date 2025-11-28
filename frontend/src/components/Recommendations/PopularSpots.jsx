// src/components/Recommendations/PopularSpots.jsx
import { useEffect, useState } from "react";
import { fetchPopularSpots } from "../../services/recommendationService";
import "../../styles/recommendations.css";

export default function PopularSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <li key={loc.id || loc._id || index} className="rec-item">
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
    </div>
  );
}

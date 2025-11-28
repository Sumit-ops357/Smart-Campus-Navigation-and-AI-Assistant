// src/components/Recommendations/SmartSuggestions.jsx
import { useEffect, useState } from "react";
import { fetchSmartSuggestions } from "../../services/recommendationService";
import "../../styles/recommendations.css";

export default function SmartSuggestions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchSmartSuggestions();
      setItems(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="rec-card">
      <h3 className="rec-title">🔮 Smart Suggestions</h3>

      {loading && <p className="rec-muted">Loading suggestions…</p>}

      {!loading && items.length === 0 && (
        <p className="rec-muted">
          No live suggestions yet. Try visiting canteen or library during peak
          hours!
        </p>
      )}

      <ul className="rec-list">
        {items.map((item) => (
          <li key={item.id || item._id} className="rec-item">
            <div className="rec-item-header">
              <span className="rec-badge">{item.tag || "Suggested"}</span>
              <span className="rec-name">{item.name}</span>
            </div>
            {item.reason && (
              <p className="rec-reason">
                {item.reason}
              </p>
            )}
            {item.timeInfo && (
              <p className="rec-time">{item.timeInfo}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

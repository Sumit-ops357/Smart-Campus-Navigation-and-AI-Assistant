import { useEffect, useState } from "react";
import { fetchSmartSuggestions } from "../../services/recommendationService";
import "../../styles/recommendations.css";

export default function SmartSuggestions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // NEW

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
          <li
            key={item.id || item._id}
            className="rec-item rec-item-clickable"   // clickable
            onClick={() => setSelected(item)}        // NEW
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="rec-image"
              />
            )}

            <div className="rec-item-header">
              <span className="rec-badge">{item.tag || "Suggested"}</span>
              <span className="rec-name">{item.name}</span>
            </div>
            {item.reason && (
              <p className="rec-reason">{item.reason}</p>
            )}
            {item.timeInfo && (
              <p className="rec-time">{item.timeInfo}</p>
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

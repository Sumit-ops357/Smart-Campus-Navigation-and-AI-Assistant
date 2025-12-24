import { useEffect, useState } from "react";
import { fetchSmartSuggestions } from "../../services/recommendationService";
import "../../styles/recommendations.css";

export default function SmartSuggestions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSmartSuggestions();
        if (data && data.length > 0) {
          setItems(data);
        } else {
          // MOCK DATA FOR DEMO
          setItems([
            {
              id: 'm1',
              name: 'Central Library',
              tag: 'Study Time',
              imageUrl: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=600',
              reason: 'It is quiet right now. Perfect for studying.',
              timeInfo: 'Open until 10 PM'
            },
            {
              id: 'm2',
              name: 'Student Canteen',
              tag: 'Lunch Break',
              imageUrl: 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=600',
              reason: 'Special menu available today.',
              timeInfo: 'Closes at 4 PM'
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to load suggestions", err);
        // Fallback mock
        setItems([
          {
            id: 'm1',
            name: 'Central Library',
            tag: 'Study Time',
            imageUrl: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=600',
            reason: 'It is quiet right now. Perfect for studying.',
            timeInfo: 'Open until 10 PM'
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
        <span>🔮</span> Smart Suggestions
      </div>

      {loading && <p className="rec-empty">Loading suggestions...</p>}

      {!loading && items.length === 0 && (
        <div className="rec-empty">
          No live suggestions right now. Try visiting more locations!
        </div>
      )}

      <div className="rec-card-grid">
        {items.map((item) => (
          <div
            key={item.id || item._id}
            className="rec-card-item"
            onClick={() => setSelected(item)}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="rec-card-image"
              />
            ) : (
              <div className="rec-card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No Image</div>
            )}

            <div className="rec-card-content">
              <span className="rec-card-badge badge-smart">
                {item.tag || "Suggested"}
              </span>
              <h4 className="rec-card-title">{item.name}</h4>
              <p className="rec-card-desc">
                {item.reason || item.description || "Based on your recent activity and time of day."}
              </p>

              {item.timeInfo && (
                <div className="rec-card-footer">
                  🕐 {item.timeInfo}
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
                {selected.reason || selected.description}
              </p>
              {selected.locationName && (
                <p><strong>Location:</strong> {selected.locationName}</p>
              )}
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

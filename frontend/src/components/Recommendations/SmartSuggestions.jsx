import { useEffect, useState } from "react";
import { fetchSmartSuggestions } from "../../services/recommendationService";
import LocationDetailModal from "../Map/LocationDetailModal";
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
              category: 'Academic',
              imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbSVthKkyiaw7FIlH7E8iAp1xZS8JdPbN6Fg&s',
              reason: 'It is quiet right now. Perfect for studying.',
              timeInfo: 'Open until 10 PM',
              building: 'Library Block',
              description: 'It is quiet right now. Perfect for studying.'
            },
            {
              id: 'm2',
              name: 'Student Canteen',
              tag: 'Lunch Break',
              category: 'Facilities',
              imageUrl: 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=600',
              reason: 'Special menu available today.',
              timeInfo: 'Closes at 4 PM',
              building: 'Canteen Block',
              description: 'Special menu available today.'
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
            category: 'Academic',
            imageUrl: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=600',
            reason: 'It is quiet right now. Perfect for studying.',
            timeInfo: 'Open until 10 PM',
            building: 'Library Block',
             description: 'It is quiet right now. Perfect for studying.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCardClick = (item) => {
      // Map item to location format if necessary, or ensure mock data matches
      const locationData = {
          ...item,
          category: item.category || item.tag || 'Suggestion',
          openingHours: item.timeInfo || 'See details',
          description: item.reason || item.description,
          // meaningful defaults
          amenities: item.amenities || [],
          floor: item.floor || 'Ground'
      };
      setSelected(locationData);
  };

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
            onClick={() => handleCardClick(item)}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="rec-card-image"
              />
            ) : (
              <div className="rec-card-image rec-card-placeholder">
                <span>📍</span>
              </div>
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
        <LocationDetailModal 
            location={selected} 
            onClose={() => setSelected(null)} 
        />
      )}
    </section>
  );
}

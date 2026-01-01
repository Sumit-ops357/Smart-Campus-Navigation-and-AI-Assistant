import { useState } from "react";
import "../../styles/sports.css";

const sportsData = [
  {
    id: 1,
    title: "Gymkhana",
    badge: "Indoor Hub",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    description:
      "The central hub for indoor games, fitness activities, and student clubs. Managed by the Physical Education Department.",
    timings: "6:00 am – 8:30 am & 4:30 pm – 9:00 pm",
    details:
      "The Gymkhana is equipped with state-of-the-art equipment for bodybuilding, powerlifting, and general fitness. It also houses table tennis tables, chess boards, and carrom boards for indoor recreation.",
  },
  {
    id: 2,
    title: "Cricket Playground",
    badge: "Outdoor Field",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80",
    description:
      "Full-size cricket ground used for university teams, practice nets, and inter-department tournaments.",
    timings: "6:00 am – 8:00 am & 4:30 pm – 7:00 pm",
    timingLabel: "Practice Slots",
    details:
      "A well-maintained turf wicket primarily used for university matches and inter-college tournaments. Practice nets are available for students during designated slots.",
  },
  {
    id: 3,
    title: "Outdoor Facilities",
    badge: "Courts",
    image: "https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=800&q=80",
    description:
      "Multiple flood-lit courts available near the Gymkhana for evening practice.",
    timings: "5:00 pm – 9:00 pm",
    timingLabel: "General Timings",
    list: ["Basketball Court (Synthetic)", "Volleyball Courts (Outdoor)"],
    details:
      "These courts are flood-lit to allow for evening practice sessions. The basketball court features a synthetic surface for professional-level play, while the volleyball courts are clay-based.",
  },
];

export default function SportsPage() {
  const [selectedSport, setSelectedSport] = useState(null);

  const handleCardClick = (sport) => {
    setSelectedSport(sport);
  };

  const closeModal = () => {
    setSelectedSport(null);
  };

  return (
    <div className="sports-page">
      <div className="sports-container">
        <h1 className="sports-title">Campus Sports & Gymkhana</h1>
        <p className="sports-subtitle">
          Check timings, playgrounds, and outdoor sports facilities available on
          campus.
        </p>

        <div className="sports-grid">
          {sportsData.map((sport) => (
            <div
              key={sport.id}
              className="sports-card"
              onClick={() => handleCardClick(sport)}
            >
              <div className="sports-image-wrapper">
                <img
                  src={sport.image}
                  alt={sport.title}
                  className="sports-image"
                />
              </div>
              <div className="sports-card-body">
                <span className="sports-card-badge">{sport.badge}</span>
                <h2 className="sports-card-title">{sport.title}</h2>
                <p className="sports-text">{sport.description}</p>
                {sport.list && (
                  <ul className="sports-list">
                    {sport.list.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
                <div className="sports-card-footer">
                  <strong>{sport.timingLabel || "Timings"}:</strong>
                  <span className="sports-highlight">{sport.timings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedSport && (
          <div className="sports-detail-overlay" onClick={closeModal}>
            <div
              className="sports-detail-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="sports-detail-close-btn" onClick={closeModal}>
                &times;
              </button>
              <div
                className="sports-modal-image-wrapper"
                style={{
                  backgroundImage: `url(${selectedSport.image})`,
                }}
              >
                <div className="sports-modal-header">
                  <span className="sports-modal-badge">
                    {selectedSport.badge}
                  </span>
                  <h2 className="sports-modal-title">{selectedSport.title}</h2>
                </div>
              </div>

              <div className="sports-modal-content">
                <p className="sports-modal-description">
                  {selectedSport.description}
                </p>

                {selectedSport.details && (
                  <p className="sports-modal-details">
                    {selectedSport.details}
                  </p>
                )}

                {selectedSport.list && (
                  <div className="sports-modal-list-section">
                    <h4>Facilities Available:</h4>
                    <ul>
                      {selectedSport.list.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="sports-modal-footer">
                  <h4>{selectedSport.timingLabel || "Timings"}</h4>
                  <p className="sports-time-highlight">
                    {selectedSport.timings}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

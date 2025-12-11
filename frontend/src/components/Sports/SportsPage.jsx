// src/components/Sports/SportsPage.jsx

import "../../styles/sports.css";

const gymkhanaImage =
  "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg";
const cricketImage =
  "https://images.pexels.com/photos/1408899/pexels-photo-1408899.jpeg";
const courtsImage =
  "https://images.pexels.com/photos/1408347/pexels-photo-1408347.jpeg";

export default function SportsPage() {
  return (
    <div className="sports-page">
      <h1 className="sports-title">Campus Sports &amp; Gymkhana</h1>
      <p className="sports-subtitle">
        Check timings, playgrounds, and outdoor sports facilities available on
        campus.
      </p>

      {/* Gymkhana */}
      <section className="sports-section">
        <div className="sports-card">
          <img src={gymkhanaImage} alt="Gymkhana" className="sports-image" />
          <div className="sports-card-body">
            <h2 className="sports-card-title">Gymkhana</h2>
            <p className="sports-text">
              The Gymkhana is the central hub for indoor games, fitness
              activities, and student clubs. It is managed by the Physical
              Education Department and open to all registered students.
            </p>
            <p className="sports-text">
              <strong>Timings:</strong> 6:00 am – 8:30 am and 4:30 pm – 9:00 pm
              (Monday to Saturday)
            </p>
            <p className="sports-text">
              <strong>Location:</strong> Near main playground, behind BT
              Auditorium.
            </p>
          </div>
        </div>
      </section>

      {/* Cricket ground */}
      <section className="sports-section">
        <div className="sports-card">
          <img
            src={cricketImage}
            alt="Cricket playground"
            className="sports-image"
          />
          <div className="sports-card-body">
            <h2 className="sports-card-title">Cricket Playground</h2>
            <p className="sports-text">
              Full-size cricket ground used for university teams, practice nets,
              and inter-department tournaments.
            </p>
            <p className="sports-text">
              <strong>Student Practice Timings:</strong> 6:00 am – 8:00 am and
              4:30 pm – 7:00 pm (slots coordinated by the sports office).
            </p>
          </div>
        </div>
      </section>

      {/* Outdoor courts */}
      <section className="sports-section">
        <div className="sports-card">
          <img
            src={courtsImage}
            alt="Outdoor courts"
            className="sports-image"
          />
          <div className="sports-card-body">
            <h2 className="sports-card-title">Outdoor Sports Facilities</h2>
            <p className="sports-text">
              Multiple flood-lit courts are available near the Gymkhana for
              evening practice and friendly matches.
            </p>
            <ul className="sports-list">
              <li>Basketball Court (1 full court, synthetic surface)</li>
              <li>Volleyball Courts (2 outdoor courts)</li>
            </ul>
            <p className="sports-text">
              <strong>General Timings:</strong> 5:00 pm – 9:00 pm (equipment
              issue from Gymkhana office).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

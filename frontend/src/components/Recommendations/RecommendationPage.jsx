// src/components/Recommendations/RecommendationPage.jsx

import SmartSuggestions from "./SmartSuggestions";
import PopularSpots from "./PopularSpots";
import "../../styles/recommendations.css";

export default function RecommendationPage() {
  return (
    <div className="rec-page">
      <div className="rec-page-inner">
        <div className="rec-page-header">
          <h2>🎯 Personalized Campus Recommendations</h2>
          <p>
            These recommendations are powered by your activity and the Gemini
            API on the backend. Explore where to go next, best times to visit,
            and trending spots on campus.
          </p>
        </div>

        <div className="rec-page-grid">
          <SmartSuggestions />
          <PopularSpots />
        </div>
      </div>
    </div>
  );
}

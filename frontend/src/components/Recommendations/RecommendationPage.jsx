// src/components/Recommendations/RecommendationPage.jsx

import SmartSuggestions from "./SmartSuggestions";
import PopularSpots from "./PopularSpots";
import "../../styles/recommendations.css";

export default function RecommendationPage() {
  return (
    <div className="rec-page">
      <div className="rec-page-inner">
        <div className="rec-page-header">
          <h2>🎯 Personalized Recommendations</h2>
          <p>
            Powered by your activity and AI analysis. Discover smart suggestions
            and trending spots on campus.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="rec-page-layout">
          {/* Left Column */}
          <SmartSuggestions />

          {/* Right Column */}
          <PopularSpots />
        </div>
      </div>
    </div>
  );
}

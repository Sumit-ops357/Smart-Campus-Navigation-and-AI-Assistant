// src/components/Navigation/LocationList.jsx

import { categoryColors, campusLocations } from "../../data/campusLocations";

const LocationList = ({
  activeId,
  onSelect,
  categories = ["Academic", "Facilities", "Sports"]
}) => (
  <div className="location-list">
    {categories.map((cat) => (
      <div key={cat} className="location-category-group">
        <div
          className="location-category-header"
          style={{ background: categoryColors[cat], color: "#fff" }}
        >
          {cat}
        </div>
        {campusLocations
          .filter((loc) => loc.category === cat)
          .map((loc) => (
            <button
              key={loc.id}
              className={`location-list-item${
                activeId === loc.id ? " location-list-item-active" : ""
              }`}
              onClick={() => onSelect(loc)}
            >
              <span className="location-list-icon">{loc.icon}</span>
              <span className="location-list-name">{loc.name}</span>
              <span className="location-list-building">{loc.building}</span>
            </button>
          ))}
      </div>
    ))}
  </div>
);

export default LocationList;

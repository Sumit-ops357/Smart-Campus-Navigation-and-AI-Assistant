// src/components/Navigation/SearchBar.jsx

import { useState } from "react";
import { searchLocations } from "../../data/campusLocations";

const SearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      setResults(searchLocations(value).slice(0, 8));
    } else {
      setResults([]);
    }
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search locations, dept, facility..."
        value={query}
        onChange={handleChange}
        className="searchbar-input"
        autoComplete="off"
      />
      {results.length > 0 && (
        <div className="searchbar-dropdown">
          {results.map((loc) => (
            <button
              key={loc.id}
              className="searchbar-item"
              onClick={() => {
                setQuery("");
                setResults([]);
                onSelect(loc);
              }}
            >
              <span className="searchbar-icon">{loc.icon}</span>
              <span>{loc.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

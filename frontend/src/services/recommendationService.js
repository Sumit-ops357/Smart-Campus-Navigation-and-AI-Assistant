// src/services/recommendationService.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Get time-aware smart suggestions
export const fetchSmartSuggestions = async () => {
  try {
    const res = await api.get("/api/recommendations/smart");
    return res.data || [];
  } catch (err) {
    console.error("Error fetching smart suggestions:", err);
    return [];
  }
};

// Get popular spots
export const fetchPopularSpots = async () => {
  try {
    const res = await api.get("/api/recommendations/popular");
    return res.data || [];
  } catch (err) {
    console.error("Error fetching popular spots:", err);
    return [];
  }
};

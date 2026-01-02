// src/services/recommendationService.js
import axios from "axios";

import { API_BASE } from "../config/apiConfig";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

export const fetchSmartSuggestions = async () => {
  try {
    const res = await api.get("/api/recommendations/smart");
    return res.data || [];
  } catch (err) {
    console.error("Error fetching smart suggestions:", err);
    return [];
  }
};

export const fetchPopularSpots = async () => {
  try {
    const res = await api.get("/api/recommendations/popular");
    return res.data || [];
  } catch (err) {
    console.error("Error fetching popular spots:", err);
    return [];
  }
};

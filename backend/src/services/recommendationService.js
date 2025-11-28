// backend/src/services/recommendationService.js

const Location = require("../models/Location");
const { askGemini } = require("./aiService");
const { campusLocations } = require("../data/campusLocations");


const getCurrentHour = () => new Date().getHours();

const getSmartSuggestions = async () => {
  const hour = getCurrentHour();

  const suggestions = [];

  if (hour >= 12 && hour <= 15) {
    const canteens = await Location.find({ category: "Facilities", name: /canteen/i }).limit(3);
    suggestions.push(...canteens);
  }

  // Quiet study: Academic (e.g., library-like)
  const academics = await Location.find({ category: "Academic" }).limit(3);
  suggestions.push(...academics);

  return suggestions;
};

const getPopularSpots = async () => {
  const spots = await Location.find({}).sort({ createdAt: -1 }).limit(6);
  return spots;
};

module.exports = { getSmartSuggestions, getPopularSpots };

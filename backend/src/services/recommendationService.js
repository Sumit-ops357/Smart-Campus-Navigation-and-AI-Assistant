// backend/src/services/recommendationService.js

const Location = require("../models/Location");
const { askGemini } = require("./aiService");

// Helper: current hour (0–23)
const getCurrentHour = () => new Date().getHours();

// Helper: build JSON-friendly context for Gemini
const buildLocationContext = async () => {
  const locations = await Location.find({}).lean().limit(50);
  return locations.map((loc) => ({
    id: String(loc._id),
    name: loc.name,
    category: loc.category,
    building: loc.building || "",
    description: loc.description || "",
    openingHours: loc.openingHours || "",
  }));
};

/**
 * SMART SUGGESTIONS
 * Returns:
 * [
 *   { id, name, tag, reason, timeInfo }
 * ]
 */
const getSmartSuggestions = async () => {
  const hour = getCurrentHour();
  const context = await buildLocationContext();

  const prompt = `
You are an AI recommendation engine for a university campus.

Current time (24h): ${hour}:00

Here is JSON data of campus locations:
${JSON.stringify(context)}

Using ONLY this information and common sense:
- Suggest 3–6 useful places a student might want to go *right now*.
- Consider time of day (lunch at canteen, quiet study, evening sports, etc.).
- For each suggestion, pick a short tag like "Food", "Quiet study", "Sports", "Events".

Return ONLY valid JSON (no markdown, no extra text) in EXACTLY this format:

[
  {
    "id": "<id from input list>",
    "name": "<location name>",
    "tag": "<short label>",
    "reason": "<1–2 sentence friendly explanation>",
    "timeInfo": "<optional info about best time / crowd level>"
  }
]
`;

  try {
    const text = await askGemini(prompt);

    // 🔹 If AI not configured / unavailable, skip JSON.parse and fallback
    if (
      !text ||
      text.startsWith("AI is not configured yet") ||
      text.startsWith("Sorry, the AI service is unavailable")
    ) {
      throw new Error(text);
    }

    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    console.warn(
      "Smart suggestions: Gemini JSON was not an array, using fallback."
    );
  } catch (err) {
    console.error(
      "Smart suggestions via Gemini failed, using fallback:",
      err.message
    );
  }

  // --- Fallback: simple DB-based suggestions ---
  const fallbackLocations = await Location.find({}).limit(5).lean();

  return fallbackLocations.map((loc) => ({
    id: String(loc._id),
    name: loc.name,
    tag: loc.category || "Suggested",
    reason:
      loc.description ||
      "Highlighted campus location based on basic rules (AI unavailable).",
    timeInfo: loc.openingHours || "",
  }));
};

/**
 * POPULAR SPOTS
 * Returns:
 * [
 *   { id, name, category, visits, reason }
 * ]
 */
const getPopularSpots = async () => {
  const locations = await Location.find({}).lean().limit(50);

  const compact = locations.map((loc) => ({
    id: String(loc._id),
    name: loc.name,
    category: loc.category,
    building: loc.building || "",
    description: loc.description || "",
  }));

  const prompt = `
You are an analytics assistant for a university campus.

Below is JSON with campus locations:
${JSON.stringify(compact)}

Based on typical student behavior, choose 4–8 locations that would be
the most popular or frequently visited (canteens, main buildings, parks, sports areas, etc.).

Return ONLY valid JSON (no markdown, no prose) in EXACTLY this format:

[
  {
    "id": "<id from input list>",
    "name": "<location name>",
    "category": "<category>",
    "visits": <integer popularity score>,
    "reason": "<short explanation why it is popular>"
  }
]

"visits" is NOT real analytics, just an approximate score you invent (e.g. 20–500).
`;

  try {
    const text = await askGemini(prompt);

    if (
      !text ||
      text.startsWith("AI is not configured yet") ||
      text.startsWith("Sorry, the AI service is unavailable")
    ) {
      throw new Error(text);
    }

    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    console.warn(
      "Popular spots: Gemini JSON was not an array, using fallback."
    );
  } catch (err) {
    console.error(
      "Popular spots via Gemini failed, using fallback:",
      err.message
    );
  }

  // --- Fallback: most recent locations as "popular" ---
  const fallbackSpots = await Location.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  return fallbackSpots.map((loc, index) => ({
    id: String(loc._id),
    name: loc.name,
    category: loc.category,
    visits: 100 - index * 7, // fake stable number
    reason: loc.description || "Frequently used campus location.",
  }));
};

module.exports = { getSmartSuggestions, getPopularSpots };

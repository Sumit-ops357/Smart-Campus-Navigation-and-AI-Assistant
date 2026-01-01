// backend/src/services/eventService.js

const { askGemini } = require("./aiService");

function buildEventsPrompt() {
  return `
You are an assistant for a "Smart Campus Navigator" app.

Generate 4–6 upcoming campus events for THIS WEEK only.
Use realistic events for an engineering campus
(tech talks, workshops, hackathons, cultural fests, sports, etc.).

Return **ONLY** a valid JSON array. No markdown, no backticks, no extra text.

Each event object MUST have:

- id: string (unique, e.g. "event-1")
- title: string
- category: string  (e.g. "Tech Talk", "Workshop", "Cultural", "Sports")
- description: string (2–3 sentences max)
- location: string (e.g. "Main Auditorium", "Robotics Lab")
- startTime: ISO 8601 date-time string from now onwards
- endTime: ISO 8601 date-time string later than startTime

Example shape (FORMAT ONLY):

[
  {
    "id": "event-1",
    "title": "Intro to Robotics Club Meetup",
    "category": "Tech Talk",
    "description": "Short description here...",
    "location": "Robotics Lab",
    "startTime": "2025-12-01T15:30:00+05:30",
    "endTime": "2025-12-01T17:00:00+05:30"
  }
]

REMEMBER: respond with JSON ONLY.
`.trim();
}

async function generateAiEvents() {
  try {
    const prompt = buildEventsPrompt();
    const raw = await askGemini(prompt);

    if (!raw || typeof raw !== "string") {
      console.error("[Events] Gemini returned non-string:", raw);
      return [];
    }

    let jsonText = raw.trim();

    // if Gemini wraps in ```json ... ```
    if (jsonText.startsWith("```")) {
      jsonText = jsonText
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();
    }

    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) {
      console.error("[Events] Gemini JSON is not an array:", parsed);
      return [];
    }

    return parsed
      .filter(e => e && typeof e === "object")
      .map((e, i) => ({
        id: e.id || `ai-event-${i + 1}`,
        title: e.title || "Campus Event",
        category: e.category || "General",
        description: e.description || "",
        location: e.location || "Campus",
        startTime: e.startTime || new Date().toISOString(),
        endTime:
          e.endTime ||
          new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }));
  } catch (err) {
    console.error("[Events] Failed to parse Gemini events:", err);
    return [];
  }
}

// 🔴 We return NO stored events at all
async function getStoredEvents() {
  return [];
}

module.exports = {
  generateAiEvents,
  getStoredEvents,
};

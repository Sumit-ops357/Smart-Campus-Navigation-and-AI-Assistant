// backend/src/controllers/chatController.js
// Simple Gemini chat controller (same role as old /api/ai/chat)

const { askGemini } = require("../services/aiService");
const { campusLocations } = require("../data/campusLocations");

/**
 * POST /api/chat/message
 * body: { message: string, history: [{ from: "user"|"ai", text: string }] }
 * response: { reply: string }
 */
const chatWithAi = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const locationsText = campusLocations
      .map(
        (loc) =>
          `- ${loc.name} (${loc.category}) in ${loc.building}, amenities: ${(
            loc.amenities || []
          ).join(", ")}`
      )
      .join("\n");

    const historyText = history
      .map((m) => `${m.from === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

    const prompt = `
You are a friendly campus assistant for KLE Technological University (BVB Campus) in Hubballi.

You know these campus locations:
${locationsText}

Conversation so far:
${historyText}

Rules:
- Answer questions about places on campus (canteen, library, sports, labs, etc.) in 2–4 short sentences.
- When the user asks "Where is X?", briefly explain where it is (block/building, nearby landmarks).
- You MAY suggest that they share their current location (e.g. Main Entrance Gate, CLITE, Canteen Block)
  if they want detailed directions, but you don't have to output numbered steps.
- Stay strictly inside this campus. Avoid generic advice like "look for signs" or "ask security" unless asked.

User message: ${message.trim()}
`.trim();

    const replyText = await askGemini(prompt, history);

    res.json({
      reply: replyText || "Sorry, I could not answer that.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { chatWithAi };

// backend/src/services/aiService.js

const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

/**
 * Call Google Gemini API with chat history and latest message.
 * history = [{ from: 'user' | 'ai', text: '...' }, ...]
 */
const askGemini = async (message, history = []) => {
  if (!GEMINI_API_KEY) {
    return "AI is not configured yet on the server.";
  }

  const contents = [
    ...history.map((m) => ({
      role: m.from === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await axios.post(url, { contents });
    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't generate a response.";
    return text;
  } catch (err) {
    console.error("Gemini error:", err.response?.data || err.message);
    return "Sorry, the AI service is unavailable right now.";
  }
};

module.exports = { askGemini };

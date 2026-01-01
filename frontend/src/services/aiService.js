// frontend/src/services/aiService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Send a chat message to backend AI endpoint.
 * history = [{ from: "user" | "ai", text: "..." }]
 */
export const sendChatMessage = async (message, history = []) => {
  const res = await axios.post(`${API_URL}/api/chat/message`, {
    message,
    history,
  });
  return res.data; // { reply }
};

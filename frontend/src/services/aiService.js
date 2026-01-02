import { API_BASE } from "../config/apiConfig";

const API_URL = API_BASE;

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

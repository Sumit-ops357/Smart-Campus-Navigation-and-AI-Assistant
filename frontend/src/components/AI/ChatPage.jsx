// src/components/AI/ChatPage.jsx

import { useState } from "react";
import ChatMessage from "./ChatMessage";
import { sendChatMessage } from "../../services/aiService";
import { campusLocations } from "../../data/campusLocations";
import { useNavigate } from "react-router-dom";
import { useRoute } from "../../context/RouteContext";
import "./chat.css";

// detect any campus location mentioned in text
const detectLocationFromText = (text) => {
  const lower = text.toLowerCase();
  return (
    campusLocations.find(
      (loc) =>
        lower.includes(loc.name.toLowerCase()) ||
        (loc.building && lower.includes(loc.building.toLowerCase()))
    ) || null
  );
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text:
        "Hi! I’m your Smart Campus Assistant. Ask me things like:\n" +
        "• Where is the canteen?\n" +
        "• Take me to the library\n" +
        "• Where can I play cricket?\n" +
        "• Show me a quiet place to study",
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  // navigation to map (replaces old onNavigateToLocation prop)
  const { clearRoute, setEndLocation } = useRoute();
  const navigate = useNavigate();

  const handleNavigateSuggestion = (userText) => {
    const match = detectLocationFromText(userText);
    if (!match) return;

    clearRoute();
    setEndLocation(match);
    navigate("/"); // go to map; CampusMap + RouteInfo handle directions
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const newUserMsg = { from: "user", text: trimmed };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setInput("");
    setIsSending(true);

    try {
      const historyForBackend = newMessages.map((m) => ({
        from: m.from,
        text: m.text,
      }));

      const { reply } = await sendChatMessage(trimmed, historyForBackend);

      const aiMsg = {
        from: "ai",
        text: reply || "Sorry, I didn’t get that.",
      };

      setMessages([...newMessages, aiMsg]);

      // same behavior as old ChatInterface: auto‑navigate based on user message
      handleNavigateSuggestion(trimmed);
    } catch (err) {
      console.error("AI chat error:", err);
      setMessages([
        ...newMessages,
        {
          from: "ai",
          text: "Sorry, the AI service is unavailable right now.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>AI Assistant</h2>
        </div>
        <p className="chat-sidebar-info">
          Chat with the Smart Campus Assistant and jump to locations on the map.
        </p>
      </aside>

      <main className="chat-main">
        <div className="chat-main-header">
          <h2>Smart Campus AI Assistant</h2>
        </div>

        <div className="chat-main-body">
          {messages.map((m, idx) => (
            <ChatMessage key={idx} from={m.from} text={m.text} />
          ))}
        </div>

        <form className="chat-input-bar" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Ask me anything about the campus..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={isSending || !input.trim()}>
            {isSending ? "…" : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}

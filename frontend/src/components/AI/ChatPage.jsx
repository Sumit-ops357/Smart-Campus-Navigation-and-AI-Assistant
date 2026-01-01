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
      <aside className="chat-sidebar premium-glass">
        <div className="chat-sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-icon">🤖</span>
            <h2>AI Assistant</h2>
          </div>
        </div>
        <div className="chat-sidebar-content">
          <p className="chat-sidebar-info">
            Your personal campus guide. Ask about locations, events, or sports facilities.
          </p>
          <div className="sidebar-features">
            <div className="feature-pill">📍 Map Navigation</div>
            <div className="feature-pill">📅 Event Info</div>
            <div className="feature-pill">🏸 Sports Booking</div>
          </div>
        </div>
      </aside>

      <main className="chat-main">
        <div className="chat-main-header glass-header">
          <div className="ai-status">
            <div className="status-dot online"></div>
            <span>Assistant Online</span>
          </div>
        </div>

        <div className="chat-main-body custom-scrollbar">
          {messages.map((m, idx) => (
            <ChatMessage key={idx} from={m.from} text={m.text} />
          ))}
        </div>

        <div className="chat-input-wrapper">
          <form className="chat-input-bar floating-pill" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="send-btn" disabled={isSending || !input.trim()}>
              {isSending ? (
                <span className="loader"></span>
              ) : (
                <>
                  <span className="btn-text">Send</span>
                  <svg className="send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

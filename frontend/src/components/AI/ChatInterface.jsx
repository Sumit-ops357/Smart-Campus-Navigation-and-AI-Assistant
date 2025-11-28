// src/components/AI/ChatInterface.jsx

import { useState } from "react";
import ChatMessage from "./ChatMessage";
import { sendChatMessage } from "../../services/aiService";

const ChatInterface = ({ locations = [], onNavigateToLocation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi! I’m your Smart Campus Assistant. Ask me things like:\n• Where is the canteen?\n• Take me to the library\n• Where can I play cricket?\n• Show me a quiet place to study",
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  const toggleOpen = () => setIsOpen((v) => !v);

  const detectLocationFromText = (text) => {
    const lower = text.toLowerCase();
    return (
      locations.find(
        (loc) =>
          lower.includes(loc.name.toLowerCase()) ||
          (loc.building && lower.includes(loc.building.toLowerCase()))
      ) || null
    );
  };

  const handleNavigateSuggestion = (userText) => {
    const match = detectLocationFromText(userText);
    if (match && onNavigateToLocation) {
      onNavigateToLocation(match);
    }
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

      // simple auto-navigation based on user's message
      handleNavigateSuggestion(trimmed);
    } catch (err) {
      console.error("AI chat error:", err);
      setMessages([
        ...newMessages,
        { from: "ai", text: "Sorry, the AI service is unavailable right now." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        className="chat-fab"
        onClick={toggleOpen}
        title="Ask Campus AI"
      >
        🤖
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Smart Campus AI Assistant</span>
            <button className="chat-close-btn" onClick={toggleOpen}>
              ×
            </button>
          </div>

          <div className="chat-body">
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
              {isSending ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatInterface;

// src/components/AI/ChatMessage.jsx

const ChatMessage = ({ from, text }) => {
  const isUser = from === "user";

  return (
    <div className={`chat-line ${isUser ? "chat-user" : "chat-ai"}`}>
      <div className="chat-avatar">
        {isUser ? "👤" : "🤖"}
      </div>
      <div className="chat-bubble-container">
        <div className="chat-bubble">
          {text}
        </div>
        <span className="chat-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};

export default ChatMessage;

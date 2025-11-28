// src/components/AI/ChatMessage.jsx

const ChatMessage = ({ from, text }) => {
  const isUser = from === "user";

  return (
    <div className={`chat-message ${isUser ? "chat-message-user" : "chat-message-ai"}`}>
      <div className="chat-message-avatar">
        {isUser ? "🧑" : "🤖"}
      </div>
      <div className="chat-message-bubble">
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;

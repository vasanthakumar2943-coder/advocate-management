import React, { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { from: "other", text: "hello" }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages([...messages, { from: "me", text: message }]);
    setMessage("");
  };

  return (
    <div className="chat-wrapper">
      {/* HEADER */}
      <div className="chat-header">
        <strong>Chat</strong>
      </div>

      {/* MESSAGES */}
      <div className="chat-body">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${m.from === "me" ? "me" : "other"}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="chat-input-bar">
        <label className="file-btn">
          📎
          <input type="file" hidden />
        </label>

        <input
          className="chat-input"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

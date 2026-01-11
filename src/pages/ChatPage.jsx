import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { from: "other", text: "hello" }
  ]);

  const navigate = useNavigate();

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages([...messages, { from: "me", text: message }]);
    setMessage("");
  };

  return (
    <div className="chat-wrapper">
      {/* HEADER */}
      <div className="chat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Chat</strong>

        {/* ✅ CLOSE BUTTON */}
        <button
          style={{
            background: "transparent",
            border: "none",
            fontSize: "18px",
            cursor: "pointer"
          }}
          onClick={() => navigate("/client")}
        >
          ❌
        </button>
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

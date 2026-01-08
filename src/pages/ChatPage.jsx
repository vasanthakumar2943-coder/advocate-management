import React, { useState } from "react";

export default function ChatPage() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const send = () => {
    if (!msg) return;
    setMessages([...messages, { text: msg, me: true }]);
    setMsg("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat</div>

      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={m.me ? "chat-me" : "chat-other"}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

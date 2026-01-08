import React, { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const send = () => {
    if (!text) return;
    setMessages([...messages, { text, me: true }]);
    setText("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat</div>

      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={m.me ? "msg me" : "msg"}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          placeholder="Type message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

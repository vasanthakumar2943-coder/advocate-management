import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/*
  chatId = appointment id
  Logic already locked in dashboard
*/

export default function Chat() {
  const { chatId } = useParams();

  const [messages, setMessages] = useState([
    { from: "client", text: "Hello Advocate" },
    { from: "advocate", text: "Yes, tell me your issue" },
  ]);

  const [text, setText] = useState("");
  const role = localStorage.getItem("role");

  const sendMessage = () => {
    if (!text.trim()) return;

    setMessages([...messages, { from: role, text }]);
    setText("");
  };

  return (
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-header">
        <strong>Chat</strong>
        <span className="chat-status">Online</span>
      </div>

      {/* BODY */}
      <div className="chat-body">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.from === role ? "chat-msg right" : "chat-msg left"
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="chat-footer">
        <input
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

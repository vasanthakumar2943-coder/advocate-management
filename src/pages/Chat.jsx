import React, { useState } from "react";
import { useParams } from "react-router-dom";

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
    <div className="wa-chat">
      {/* BODY */}
      <div className="wa-body">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`wa-msg ${m.from === role ? "right" : "left"}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="wa-footer">
        <label className="wa-attach">
          📎
          <input type="file" hidden />
        </label>

        <input
          placeholder="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

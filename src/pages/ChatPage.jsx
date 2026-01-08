import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ChatPage() {
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");

  const API = "https://web-production-d827.up.railway.app/api";

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      axios
        .get(`${API}/chat/${appointmentId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setMessages(res.data));
    }, 2000);

    return () => clearInterval(interval);
  }, [appointmentId, token]);

  const sendMessage = () => {
    if (!text.trim()) return;

    axios.post(
      `${API}/chat/${appointmentId}/`,
      { message: text },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setText("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat</div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${
              m.sender === username ? "me" : "other"
            }`}
          >
            {m.message}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

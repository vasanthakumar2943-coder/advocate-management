import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ChatPage() {
  const { appointmentId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const token =
    localStorage.getItem("access") || localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const API = "https://web-production-d827.up.railway.app";

  // ===========================
  // FETCH MESSAGES (POLLING)
  // ===========================
  useEffect(() => {
    if (!token) return;

    const fetchMessages = async () => {
      const res = await axios.get(
        `${API}/api/chat/${appointmentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(res.data || []);
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // 🔁 every 2 sec

    return () => clearInterval(interval);
  }, [appointmentId, token]);

  // ===========================
  // SEND MESSAGE
  // ===========================
  const sendMessage = async () => {
    if (!text.trim()) return;

    await axios.post(
      `${API}/api/chat/${appointmentId}/`,
      { message: text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setText("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat</div>

      <div className="chat-messages">
        {messages.map((m) => (
          <div
            key={m.id}
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
          placeholder="Type message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ChatPage() {
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [status, setStatus] = useState("offline");

  const wsRef = useRef(null);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  /* ============================
     CONNECT WEBSOCKET (ONCE)
  ============================ */
  useEffect(() => {
    if (!token || wsRef.current) return;

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${appointmentId}/?token=${token}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setStatus("online");
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setStatus("offline");
      wsRef.current = null;
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.message) {
        setMessages((prev) => [...prev, data]);
        setTypingUser("");
      }

      if (data.typing && data.sender !== username) {
        setTypingUser(`${data.sender} is typing...`);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      wsRef.current = null;
    };
  }, [appointmentId, token, username]);

  /* ============================
     SEND MESSAGE (SAFE)
  ============================ */
  const sendMessage = () => {
    if (!text.trim()) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not ready");
      return;
    }

    const msg = {
      message: text,
      sender: username,
    };

    // ✅ Show message instantly (WhatsApp behavior)
    setMessages((prev) => [...prev, msg]);

    wsRef.current.send(JSON.stringify(msg));
    setText("");
  };

  const sendTyping = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          typing: true,
          sender: username,
        })
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-left">
            <span className={`status-dot ${status}`} />
            <span className="chat-title">Chat</span>
          </div>

          <button
            className="chat-close"
            onClick={() => window.history.back()}
          >
            ✕
          </button>
        </div>

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

          {typingUser && <div className="typing">{typingUser}</div>}
        </div>

        <div className="chat-input">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={sendTyping}
            placeholder="Type a message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}

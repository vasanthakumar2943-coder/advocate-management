import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { appointmentId } = useParams();
  const wsRef = useRef(null);
  const typingTimeout = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState("");
  const [status, setStatus] = useState("offline");

  // ✅ SAFE TOKEN (WORKS FOR OLD + NEW LOGIN)
  const token =
    localStorage.getItem("access") || localStorage.getItem("token");
  const username = localStorage.getItem("username");

  /* ===========================
     CONNECT WEBSOCKET (FINAL)
  =========================== */
  useEffect(() => {
    if (!token) return;

    // ❌ prevent multiple sockets
    if (wsRef.current) return;

    const ws = new WebSocket(
      `wss://web-production-d827.up.railway.app/ws/chat/${appointmentId}/?token=${token}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS connected");
      setStatus("online");
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.message) {
        setMessages((prev) => [...prev, data]);
        setTyping("");
      }

      if (data.typing && data.sender !== username) {
        setTyping(`${data.sender} is typing...`);
      }
    };

    ws.onerror = (e) => {
      console.error("❌ WS error", e);
    };

    ws.onclose = () => {
      console.log("⚠️ WS closed");
      setStatus("offline");
      wsRef.current = null;
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [appointmentId, token, username]);

  /* ===========================
     SEND MESSAGE (FIXED)
  =========================== */
  const sendMessage = () => {
    if (!text.trim()) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WS not ready");
      return;
    }

    wsRef.current.send(
      JSON.stringify({
        sender: username,
        message: text,
      })
    );

    setText("");
  };

  /* ===========================
     TYPING INDICATOR
  =========================== */
  const sendTyping = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (typingTimeout.current) return;

    wsRef.current.send(
      JSON.stringify({ typing: true, sender: username })
    );

    typingTimeout.current = setTimeout(() => {
      typingTimeout.current = null;
    }, 800);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <span className={`status-dot ${status}`} />
          Chat
        </div>
        <button className="chat-close" onClick={() => window.history.back()}>
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
        {typing && <div className="typing">{typing}</div>}
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
  );
}

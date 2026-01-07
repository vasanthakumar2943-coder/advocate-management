import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ChatPage() {
  const { appointmentId } = useParams();
  const wsRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState("");
  const [status, setStatus] = useState("offline");

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  /* ===========================
     CONNECT WEBSOCKET (SAFE)
  =========================== */
  useEffect(() => {
    if (!token) return;

    // 🔥 PREVENT DOUBLE CONNECTION
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${appointmentId}/?token=${token}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
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
      console.error("WS error", e);
    };

    ws.onclose = () => {
      console.log("WS closed");
      setStatus("offline");
      wsRef.current = null;
    };

    // 🚫 DO NOT CLOSE SOCKET IN CLEANUP (STRICTMODE FIX)
    return () => {};
  }, [appointmentId, token, username]);

  /* ===========================
     SEND MESSAGE
  =========================== */
  const sendMessage = () => {
    if (!text.trim()) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WS not ready");
      return;
    }

    const msg = {
      sender: username,
      message: text,
    };

    // ✅ INSTANT UI UPDATE (WhatsApp style)
    setMessages((prev) => [...prev, msg]);

    wsRef.current.send(JSON.stringify(msg));
    setText("");
  };

  const sendTyping = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ typing: true, sender: username })
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="chat-container">
        <div className="chat-header">
          <div>
            <span className={`status-dot ${status}`} />
            Chat
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
    </>
  );
}

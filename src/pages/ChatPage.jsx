import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ChatPage() {
  const { appointmentId } = useParams();
  const wsRef = useRef(null);
  const typingTimeout = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState("");
  const [status, setStatus] = useState("offline");

  // ✅ SAFE TOKEN READ (DO NOT BREAK OTHER PAGES)
  const token =
    localStorage.getItem("access") || localStorage.getItem("token");
  const username = localStorage.getItem("username");

  /* ===========================
     CONNECT WEBSOCKET (FIXED)
  =========================== */
  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    if (wsRef.current) return;

    const ws = new WebSocket(
      `wss://web-production-d827.up.railway.app/ws/chat/${appointmentId}/?token=${token}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
      setStatus("online");
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      // ✅ PREVENT DUPLICATES
      if (data.message) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (
            last &&
            last.message === data.message &&
            last.sender === data.sender
          ) {
            return prev;
          }
          return [...prev, data];
        });
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

    return () => {};
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

    const msg = {
      sender: username,
      message: text,
    };

    // ❌ DO NOT ADD LOCALLY (SERVER WILL ECHO)
    wsRef.current.send(JSON.stringify(msg));
    setText("");
  };

  /* ===========================
     TYPING INDICATOR (THROTTLED)
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

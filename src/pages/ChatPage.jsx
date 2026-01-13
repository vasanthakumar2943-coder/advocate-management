import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../pages/Chat";

export default function ChatPage() {
  const navigate = useNavigate();
  const { chatId } = useParams();

  return (
    <div className="wa-page">
      {/* HEADER */}
      <div className="wa-header">
        <div className="wa-header-left">
          <button className="btn-primary" onClick={() => navigate(-1)}>←</button>
          <strong>Chat</strong>
        </div>

        <span className="wa-status">Online</span>
      </div>

      {/* CHAT */}
      <Chat key={chatId} />
    </div>
  );
}

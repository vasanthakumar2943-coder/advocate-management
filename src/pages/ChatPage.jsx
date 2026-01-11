import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../pages/Chat";

export default function ChatPage() {
  const navigate = useNavigate();
  const { chatId } = useParams();

  return (
    <div className="chatpage-container">
      <div className="chatpage-box">
        {/* HEADER */}
        <div className="chatpage-header">
          <strong>Chat</strong>
          <span className="chat-status">Online</span>

          <button
            className="chatpage-close"
            onClick={() => navigate(-1)}
            title="Close chat"
          >
            ✖
          </button>
        </div>

        {/* CHAT */}
        <Chat key={chatId} />
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../pages/Chat";
import "../styles/chat.css";

export default function ChatPage() {
  const navigate = useNavigate();
  const { chatId } = useParams();

  return (
    <div className="chatpage-container">
      <div className="chatpage-box">
        {/* HEADER */}
        <div className="chatpage-header">
          <strong>Chat</strong>
          <button
            className="chatpage-close"
            onClick={() => navigate(-1)}
            title="Close chat"
          >
            ✖
          </button>
        </div>

        {/* CHAT BODY */}
        <div className="chatpage-body">
          <Chat key={chatId} />
        </div>
      </div>
    </div>
  );
}

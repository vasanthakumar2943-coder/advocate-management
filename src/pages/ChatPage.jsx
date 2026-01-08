import React from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
  // ✅ READ FROM URL: /chat/:appointmentId
  const { appointmentId } = useParams();

  // 🔐 Safety check
  if (!appointmentId) {
    return <p>Invalid chat session</p>;
  }

  return (
    <div style={{ height: "100vh" }}>
      <ChatWindow appointmentId={appointmentId} />
    </div>
  );
}

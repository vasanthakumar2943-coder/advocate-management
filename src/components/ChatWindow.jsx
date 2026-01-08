import { useEffect, useRef, useState } from "react";
import {
  getChatHistory,
  sendMessage,
  uploadChatFile,
  markSeen,
  typingPing,
  getTypingStatus,
} from "../api/chat";
import ChatMessage from "./ChatMessage";
import "../styles/chat.css";

export default function ChatWindow({ appointmentId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  // Poll messages
  useEffect(() => {
    const load = async () => {
      const res = await getChatHistory(appointmentId);
      setMessages(res.data);
      markSeen(appointmentId);
    };

    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, [appointmentId]);

  // Typing poll
  useEffect(() => {
    const i = setInterval(async () => {
      const res = await getTypingStatus(appointmentId);
      setTyping(res.data.typing);
    }, 1500);

    return () => clearInterval(i);
  }, [appointmentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(appointmentId, text);
    setText("");
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    typingPing(appointmentId);
  };

  const handleFile = async (e) => {
    await uploadChatFile(appointmentId, e.target.files[0]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat</div>

      <div className="chat-body">
        {messages.map((m) => (
          <ChatMessage key={m.id} msg={m} />
        ))}
        {typing && <div className="typing">Typing...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input type="file" onChange={handleFile} />
        <input
          value={text}
          onChange={handleTyping}
          placeholder="Type a message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    API.get(`chat/${userId}/`).then(res => setMessages(res.data));
  }, [userId]);

  const sendMessage = async () => {
    const res = await API.post(`chat/${userId}/`, { text });
    setMessages([...messages, res.data]);
    setText("");
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={m.mine ? "chat-me" : "chat-other"}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

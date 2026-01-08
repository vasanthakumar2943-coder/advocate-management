export default function ChatMessage({ msg }) {
  const mine = msg.is_me;

  return (
    <div className={`message ${mine ? "me" : "other"}`}>
      <div className="bubble">
        {msg.message && <p>{msg.message}</p>}

        {msg.file && msg.file_type === "image" && (
          <img src={msg.file} alt="" className="chat-image" />
        )}

        {msg.file && msg.file_type === "pdf" && (
          <a href={msg.file} target="_blank" rel="noreferrer">
            📄 View PDF
          </a>
        )}

        <span className="time">{msg.time}</span>
      </div>
    </div>
  );
}

import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
  const appointmentId = 1; // dynamic later

  return (
    <div style={{ height: "100vh" }}>
      <ChatWindow appointmentId={appointmentId} />
    </div>
  );
}

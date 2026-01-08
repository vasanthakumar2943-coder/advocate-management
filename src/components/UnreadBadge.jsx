import { useEffect, useState } from "react";
import { getUnreadCount } from "../api/chat";

export default function UnreadBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const res = await getUnreadCount();
      setCount(res.data.unread);
    };

    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <span style={{
      background: "red",
      color: "white",
      borderRadius: "50%",
      padding: "4px 8px",
      fontSize: "12px"
    }}>
      {count}
    </span>
  );
}

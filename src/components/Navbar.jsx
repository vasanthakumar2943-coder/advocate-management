import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [showBell, setShowBell] = useState(false);

  // 🔔 Check advocate approval status
  useEffect(() => {
    if (role === "advocate") {
      checkApproval();
    }
  }, [role]);

  const checkApproval = async () => {
    try {
      const res = await API.get("me/");
      if (res.data.is_approved) {
        const notified = localStorage.getItem("approved_notified");
        if (!notified) {
          setShowBell(true);
          toast.success("🎉 Your account has been approved!");
          localStorage.setItem("approved_notified", "true");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const openNotification = () => {
    toast.info("Your advocate account is approved. You can start chatting!");
    setShowBell(false);
  };

  return (
    <div className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <strong
          className="app-title"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Advocate Management
        </strong>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        

        {/* 🔔 Approval Notification */}
        {showBell && (
          <span
            className="notification"
            style={{ cursor: "pointer" }}
            onClick={openNotification}
          >
            🔔
          </span>
        )}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

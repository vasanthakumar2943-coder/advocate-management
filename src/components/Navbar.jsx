import { useNavigate } from "react-router-dom";
import React from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login"); // ✅ FIXED
  };

  return (
    <div className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <strong className="app-title">Advocate Management</strong>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <span className="role-badge">{role}</span>

        <span className="notification">🔔</span>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

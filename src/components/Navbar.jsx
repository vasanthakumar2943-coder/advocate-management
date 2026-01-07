import { useNavigate } from "react-router-dom";
import React from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="navbar">
      <strong>Advocate Management</strong>

      <div>
        <span>{role}</span>
        <span style={{ margin: "0 10px" }}>🔔</span>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

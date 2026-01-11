import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");

  const navigate = useNavigate();

  const signup = async () => {
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      // ✅ EXACT BACKEND ROUTE
      await API.post("signup/", {
        username,
        password,
        role,
      });

      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 400) {
        alert(err.response.data?.error || "Username already exists");
      } else {
        alert("Signup failed. Server error.");
      }
    }
  };

  return (
    <div className="login-box">
      <h2>Sign Up</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="client">Client</option>
        <option value="advocate">Advocate</option>
      </select>

      <button onClick={signup}>Sign Up</button>
    </div>
  );
}

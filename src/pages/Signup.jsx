import React, { useState } from "react";
import axios from "axios";

/* ================================
   AXIOS CONFIG (FINAL)
================================ */
const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
});

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");

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
      window.location.href = "/login";
    } catch (err) {
      console.error(err);

      if (err.response?.status === 400) {
        alert("Username already exists");
      } else {
        alert("Signup failed. Check backend.");
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

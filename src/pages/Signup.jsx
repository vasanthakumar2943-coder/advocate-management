import React, { useState } from "react";
import axios from "axios";

/* =====================================================
   AXIOS BASE CONFIG (FIXED – NO LOGIC CHANGE)
   ===================================================== */
const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
  withCredentials: false, // ✅ JWT only (important for CORS)
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
      await API.post("auth/signup/", {
        username,
        password,
        role,
      });

      alert("Signup successful. Please login.");
      window.location.href = "/login";
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Username already exists. Try another.");
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
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="client">Client</option>
        <option value="advocate">Advocate</option>
      </select>

      <button onClick={signup}>Sign Up</button>
    </div>
  );
}

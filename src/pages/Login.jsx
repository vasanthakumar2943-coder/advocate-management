import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    try {
      // ======================
      // GET JWT TOKEN
      // ======================
      const tokenRes = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        { username, password }
      );

      const token = tokenRes.data.access;

      // ✅ STORE TOKEN (SINGLE SOURCE OF TRUTH)
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      // ======================
      // GET USER DETAILS
      // ======================
      const meRes = await axios.get(
        "http://127.0.0.1:8000/api/me/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { role, status } = meRes.data;

      localStorage.setItem("role", role);

      // ======================
      // ROLE BASED REDIRECT
      // ======================
      if (role === "admin") {
        window.location.href = "/admin";
        return;
      }

      if (role === "client") {
        window.location.href = "/client";
        return;
      }

      if (role === "advocate") {
        if (status === "pending") {
          alert("Waiting for admin approval");
          return;
        }
        window.location.href = "/advocate";
        return;
      }
    } catch (err) {
      console.error(err);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-box">
      <h2>Login</h2>

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

      <button onClick={login}>Login</button>

      <p>
        Don’t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

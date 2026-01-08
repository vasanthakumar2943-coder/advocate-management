import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
});

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) {
      toast.warning("Enter username and password");
      return;
    }

    try {
      // ✅ CORRECT LOGIN API (NO auth/)
      const res = await API.post("login/", {
        username,
        password,
      });

      // Save tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Get user details
      const me = await API.get("me/", {
        headers: {
          Authorization: `Bearer ${res.data.access}`,
        },
      });

      localStorage.setItem("role", me.data.role);

      toast.success("Login successful");

      // Role-based redirect
      if (me.data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (me.data.role === "advocate") {
        navigate("/advocate-dashboard");
      } else {
        navigate("/client-dashboard");
      }

    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Advocate account pending admin approval");
      } else {
        toast.error("Invalid username or password");
      }
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

      {/* Signup link */}
      <p style={{ marginTop: "12px", textAlign: "center" }}>
        Don’t have an account?{" "}
        <span
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/signup")}
        >
          Sign up
        </span>
      </p>
    </div>
  );
}

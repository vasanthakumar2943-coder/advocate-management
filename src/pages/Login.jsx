import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("login/", {
        username,
        password,
      });

      // ✅ save tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("is_approved", res.data.is_approved);

      toast.success("Login successful");

      // 🔁 redirect by role
      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (res.data.role === "advocate") {
        if (!res.data.is_approved) {
          navigate("/pending");
        } else {
          navigate("/advocate");
        }
      } else {
        navigate("/client");
      }
    } catch (err) {
      console.error(err);

      if (err.response && err.response.status === 403) {
        toast.error("Invalid username or password");
      } else {
        toast.error("Login failed. Try again");
      }
    }
  };

  return (
    <div className="login-box">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p>
        Don&apos;t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

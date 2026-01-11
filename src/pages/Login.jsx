import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
});

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) {
      toast.error("Enter username & password");
      return;
    }

    try {
      const res = await API.post("login/", { username, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("role", res.data.role);

      toast.success("Login successful");

      if (res.data.role === "admin") navigate("/admin");
      if (res.data.role === "advocate") navigate("/advocate");
      if (res.data.role === "client") navigate("/client");
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

      <p>
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

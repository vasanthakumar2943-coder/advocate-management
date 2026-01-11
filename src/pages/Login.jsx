import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Login = () => {
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

      localStorage.setItem("token", res.data.access);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (res.data.role === "advocate") {
        navigate("/advocate");
      } else {
        navigate("/client");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Invalid username or password");
      } else {
        alert("Login failed");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

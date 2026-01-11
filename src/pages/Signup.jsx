import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await API.post("signup/", {
        username,
        password,
        role,
      });

      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      alert("Signup failed. Server error.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="client">Client</option>
          <option value="advocate">Advocate</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;

import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  // ✅ USE UPDATED TOKEN KEY
  const token = localStorage.getItem("access");
  const userRole = localStorage.getItem("role");

  // 🔐 NOT LOGGED IN
  if (!token) return <Navigate to="/login" />;

  // 🔐 ROLE RESTRICTION (UNCHANGED LOGIC)
  if (role && role !== userRole) return <Navigate to="/login" />;

  return children;
}

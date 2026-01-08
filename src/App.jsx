import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ClientDashboard from "./pages/ClientDashboard";
import AdvocateDashboard from "./pages/AdvocateDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChatPage from "./pages/ChatPage";
import PendingApproval from "./pages/PendingApproval";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* ✅ ONLY HERE */}

      <Routes>
        {/* ================= AUTH ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pending" element={<PendingApproval />} />

        {/* ================= CLIENT ================= */}
        <Route
          path="/client"
          element={
            <PrivateRoute role="client">
              <ClientDashboard />
            </PrivateRoute>
          }
        />

        {/* ================= ADVOCATE ================= */}
        <Route
          path="/advocate"
          element={
            <PrivateRoute role="advocate">
              <AdvocateDashboard />
            </PrivateRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* ================= CHAT (PROTECTED) ================= */}
        <Route
          path="/chat/:appointmentId"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

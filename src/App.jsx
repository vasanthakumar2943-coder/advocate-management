import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminDashboard from "./pages/AdminDashboard";
import AdvocateDashboard from "./pages/AdvocateDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ChatPage from "./pages/ChatPage";

import Navbar from "./components/Navbar";

/* =========================
   PROTECTED ROUTE
========================= */
function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("access");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* ADVOCATE */}
        <Route
          path="/advocate"
          element={
            <PrivateRoute role="advocate">
              <AdvocateDashboard />
            </PrivateRoute>
          }
        />

        {/* CLIENT */}
        <Route
          path="/client"
          element={
            <PrivateRoute role="client">
              <ClientDashboard />
            </PrivateRoute>
          }
        />

        {/* CHAT */}
        <Route
          path="/chat/:id"
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

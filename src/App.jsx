import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdvocateDashboard from "./pages/AdvocateDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/advocate-dashboard"
          element={
            <PrivateRoute role="advocate">
              <AdvocateDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/client-dashboard"
          element={
            <PrivateRoute role="client">
              <ClientDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdvocateDashboard() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    checkApprovalAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔐 Check advocate approval
  const checkApprovalAndLoad = async () => {
    try {
      const me = await API.get("me/");

      if (!me.data.is_approved) {
        navigate("/pending");
        return;
      }

      if (!localStorage.getItem("approved_notified")) {
        toast.success("🎉 Your account has been approved!");
        localStorage.setItem("approved_notified", "true");
      }

      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  };

  // 🔄 Load both tables (LIKE ADMIN)
  const loadAll = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        API.get("advocate/appointments/requests/"),
        API.get("advocate/appointments/approved/"),
      ]);

      setPending(pendingRes.data);
      setApproved(approvedRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load advocate data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve client
  const approveClient = async (id) => {
    try {
      await API.post(`advocate/appointments/approve/${id}/`);
      toast.success("Client approved");
      loadAll(); // 🔄 refresh both tables
    } catch (err) {
      console.error(err);
      toast.error("Approval failed");
    }
  };

  return (
    <div className="page">
      <h2>Advocate Dashboard</h2>

      {/* ===================== */}
      {/* 🔴 PENDING CLIENTS */}
      {/* ===================== */}
      <h3 style={{ marginTop: "30px" }}>Pending Client Requests</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="2">Loading...</td>
            </tr>
          )}

          {!loading && pending.length === 0 && (
            <tr>
              <td colSpan="2">No pending requests</td>
            </tr>
          )}

          {pending.map((p) => (
            <tr key={p.id}>
              <td>{p.client}</td>
              <td>
                <button
                  className="btn"
                  onClick={() => approveClient(p.id)}
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===================== */}
      {/* 🟢 APPROVED CLIENTS */}
      {/* ===================== */}
      <h3 style={{ marginTop: "40px" }}>Approved Clients</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Chat</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="2">Loading...</td>
            </tr>
          )}

          {!loading && approved.length === 0 && (
            <tr>
              <td colSpan="2">No approved clients</td>
            </tr>
          )}

          {approved.map((c) => (
            <tr key={c.appointment_id}>
              <td>{c.client_name}</td>
              <td>
                <button
                  className="btn"
                  onClick={() =>
                    navigate(`/chat/${c.appointment_id}`)
                  }
                >
                  Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

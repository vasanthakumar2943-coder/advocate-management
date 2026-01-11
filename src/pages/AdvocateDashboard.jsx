import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdvocateDashboard() {
  const [requests, setRequests] = useState([]);
  const [approvedClients, setApprovedClients] = useState([]);
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

      loadRequests();
      loadApprovedClients();
    } catch (err) {
      console.error(err);
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  };

  // 📥 Pending requests
  const loadRequests = async () => {
    try {
      const res = await API.get("appointments/requests/");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approved clients list
  const loadApprovedClients = async () => {
    try {
      const res = await API.get("appointments/approved/");
      setApprovedClients(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load approved clients");
    }
  };

  // ✅ Approve appointment
  const approve = async (id) => {
    try {
      await API.post(`appointments/approve/${id}/`);
      toast.success("Client request approved");

      loadRequests();
      loadApprovedClients();
    } catch (err) {
      console.error(err);
      toast.error("Approval failed");
    }
  };

  return (
    <div className="page">
      {/* ================= PENDING REQUESTS ================= */}
      <h2>Client Requests</h2>

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
              <td colSpan="2">Loading requests...</td>
            </tr>
          )}

          {!loading && requests.length === 0 && (
            <tr>
              <td colSpan="2">No pending requests</td>
            </tr>
          )}

          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.client}</td>
              <td>
                <button className="btn" onClick={() => approve(r.id)}>
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= APPROVED CLIENTS ================= */}
      <h2 style={{ marginTop: "40px" }}>Approved Clients</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Chat</th>
          </tr>
        </thead>

        <tbody>
          {approvedClients.length === 0 && (
            <tr>
              <td colSpan="2">No approved clients yet</td>
            </tr>
          )}

          {approvedClients.map((c) => (
            <tr key={c.appointment_id}>
              <td>{c.client_name}</td>
              <td>
                <button
                  className="btn"
                  onClick={() => navigate(`/chat/${c.appointment_id}`)}
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

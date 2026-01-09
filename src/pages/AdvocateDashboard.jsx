import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdvocateDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkApprovalAndLoad();
  }, []);

  // 🔐 Step 1: Check advocate approval
  const checkApprovalAndLoad = async () => {
    try {
      const me = await API.get("me/");

      if (!me.data.is_approved) {
        navigate("/pending");
        return;
      }

      // 🔔 Show approval notification once
      if (!localStorage.getItem("approved_notified")) {
        toast.success("🎉 Your account has been approved!");
        localStorage.setItem("approved_notified", "true");
      }

      loadRequests();
    } catch (err) {
      console.error(err);
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  };

  // 📥 Load client appointment requests
  const loadRequests = async () => {
    try {
      const res = await API.get("appointments/?status=pending");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve appointment
  const approve = async (id, clientId) => {
    try {
      await API.post(`appointments/${id}/approve/`);
      toast.success("Client request approved");
      navigate(`/chat/${clientId}`);
    } catch (err) {
      console.error(err);
      toast.error("Approval failed");
    }
  };

  // ❌ Reject appointment
  const reject = async (id) => {
    try {
      await API.delete(`appointments/${id}/`);
      toast.success("Request deleted");
      loadRequests();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="page">
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
              <td>{r.client.username}</td>
              <td>
                <button
                  className="btn"
                  onClick={() => approve(r.id, r.client.id)}
                >
                  Approve
                </button>

                <button
                  className="btn"
                  style={{ marginLeft: "10px" }}
                  onClick={() => navigate(`/chat/${r.client.id}`)}
                >
                  Chat
                </button>

                <button
                  className="btn danger"
                  style={{ marginLeft: "10px" }}
                  onClick={() => reject(r.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

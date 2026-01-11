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
    } catch (err) {
      console.error(err);
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  };

  // 📥 Load ONLY pending appointments ✅ FIXED URL
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

  // ✅ Approve appointment
  const approve = async (id) => {
    try {
      await API.post(`appointments/approve/${id}/`);
      toast.success("Client request approved");

      // 👉 reload list after approval
      loadRequests();
    } catch (err) {
      console.error(err);
      toast.error("Approval failed");
    }
  };

  // ❌ Reject appointment (backend DELETE not implemented)
  const reject = async () => {
    toast.error("Delete not supported yet");
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
              {/* ✅ client is STRING from backend */}
              <td>{r.client}</td>
              <td>
                <button className="btn" onClick={() => approve(r.id)}>
                  Approve
                </button>

                <button
                  className="btn danger"
                  style={{ marginLeft: "10px" }}
                  onClick={reject}
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

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdvocateDashboard() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await API.get("appointments/?status=pending");
      setRequests(res.data);
    } catch {
      toast.error("Failed to load requests");
    }
  };

  const approve = async (id, clientId) => {
    try {
      await API.post(`appointments/${id}/approve/`);
      toast.success("Approved");
      navigate(`/chat/${clientId}`);
    } catch {
      toast.error("Approval failed");
    }
  };

  const reject = async (id) => {
    try {
      await API.delete(`appointments/${id}/`);
      toast.success("Deleted");
      loadRequests();
    } catch {
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

                {/* ✅ CHAT BUTTON (added only) */}
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

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }
  loadAll();
}, []);


  const loadAll = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        API.get("admin/pending-advocates/"),
        API.get("approved-advocates/"),
      ]);

      setPending(pendingRes.data);
      setApproved(approvedRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const approveAdvocate = async (id) => {
    try {
      await API.post(`admin/approve-advocate/${id}/`);
      toast.success("Advocate approved");
      loadAll(); // 🔄 refresh both tables
    } catch {
      toast.error("Approval failed");
    }
  };

  const deleteAdvocate = async (id) => {
    try {
      await API.delete(`admin/delete-advocate/${id}/`);
      toast.success("Advocate deleted");
      loadAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      {/* ===================== */}
      {/* 🔴 PENDING ADVOCATES */}
      {/* ===================== */}
      <h3 style={{ marginTop: "30px" }}>Pending Advocate Requests</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
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

          {pending.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>
                <button
                  className="btn"
                  onClick={() => approveAdvocate(u.id)}
                >
                  Approve
                </button>

                <button
                  className="btn"
                  style={{ marginLeft: "10px" }}
                  onClick={() => deleteAdvocate(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===================== */}
      {/* 🟢 APPROVED ADVOCATES */}
      {/* ===================== */}
      <h3 style={{ marginTop: "40px" }}>Approved Advocates</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
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
              <td colSpan="2">No approved advocates</td>
            </tr>
          )}

          {approved.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td style={{ color: "green", fontWeight: "bold" }}>
                Approved
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

export default function AdminPendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const res = await API.get("admin/pending-advocates/");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await API.post(`admin/approve-advocate/${id}/`);
      toast.success("Advocate approved");
      loadPending();
    } catch {
      toast.error("Approval failed");
    }
  };

  const remove = async (id) => {
    try {
      await API.delete(`admin/delete-advocate/${id}/`);
      toast.success("Advocate deleted");
      loadPending();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="page">
      <h2>Pending Advocate Requests</h2>

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

          {!loading && requests.length === 0 && (
            <tr>
              <td colSpan="2">No pending requests</td>
            </tr>
          )}

          {requests.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>
                <button className="btn" onClick={() => approve(u.id)}>
                  Approve
                </button>
                <button
                  className="btn"
                  style={{ marginLeft: "10px" }}
                  onClick={() => remove(u.id)}
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

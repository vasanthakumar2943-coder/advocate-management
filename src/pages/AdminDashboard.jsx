import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [advocates, setAdvocates] = useState([]);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const res = await API.get("users/admin/pending-advocates/");
      setAdvocates(res.data);
    } catch {
      toast.error("Failed to load requests");
    }
  };

  const approve = async (id) => {
    try {
      await API.post(`users/admin/approve-advocate/${id}/`);
      toast.success("Advocate approved");
      loadPending();
    } catch {
      toast.error("Approval failed");
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
          {advocates.length === 0 && (
            <tr>
              <td colSpan="2">No pending requests</td>
            </tr>
          )}

          {advocates.map((a) => (
            <tr key={a.id}>
              <td>{a.username}</td>
              <td>
                <button className="btn" onClick={() => approve(a.id)}>
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

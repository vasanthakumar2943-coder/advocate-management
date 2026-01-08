import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
});

export default function AdminDashboard() {
  const [advocates, setAdvocates] = useState([]);

  const auth = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  };

  const loadPending = async () => {
    const res = await API.get("admin/pending-advocates/", auth);
    setAdvocates(res.data);
  };

  const approve = async (id) => {
    await API.post(`admin/approve-advocate/${id}/`, {}, auth);
    toast.success("Advocate approved");
    loadPending();
  };

  const remove = async (id) => {
    await API.delete(`admin/delete-advocate/${id}/`, auth);
    toast.success("Advocate deleted");
    loadPending();
  };

  useEffect(() => {
    loadPending();
  }, []);

  return (
    <div className="table-box">
      <h2>Pending Advocate Requests</h2>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {advocates.map((a) => (
            <tr key={a.id}>
              <td>{a.username}</td>
              <td>
                <button onClick={() => approve(a.id)}>Approve</button>
                <button onClick={() => remove(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

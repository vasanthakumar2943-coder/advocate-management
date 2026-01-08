import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

/* =====================================================
   AXIOS BASE CONFIG (UPGRADE ONLY)
   ===================================================== */
const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api",
});

export default function AdminDashboard() {
  const [advocates, setAdvocates] = useState([]);

  // ✅ USE NEW TOKEN KEY (UPGRADE)
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    API.get("/admin/pending-advocates/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setAdvocates(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // =====================
  // APPROVE ADVOCATE (UNCHANGED LOGIC)
  // =====================
  const approve = async (id) => {
    try {
      await API.post(
        `/admin/approve-advocate/${id}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // remove from list after approve
      setAdvocates((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Approve failed");
    }
  };

  // =====================
  // DELETE ADVOCATE (UNCHANGED LOGIC)
  // =====================
  const remove = async (id) => {
    if (!window.confirm("Delete this advocate?")) return;

    try {
      await API.delete(`/admin/delete-advocate/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // remove from UI
      setAdvocates((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <>
      

      <div className="page">
        <h2>Admin Dashboard</h2>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Advocate</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {advocates.map((a) => (
                <tr key={a.id}>
                  <td>{a.username}</td>
                  <td>
                    <button onClick={() => approve(a.id)}>Approve</button>

                    <button
                      onClick={() => remove(a.id)}
                      style={{ marginLeft: "8px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {advocates.length === 0 && (
                <tr>
                  <td colSpan="2">No pending advocates</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

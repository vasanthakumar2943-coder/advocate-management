import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [advocates, setAdvocates] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/pending-advocates/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAdvocates(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // =====================
  // APPROVE ADVOCATE
  // =====================
  const approve = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/approve/${id}/`,
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
  // DELETE ADVOCATE
  // =====================
  const remove = async (id) => {
    if (!window.confirm("Delete this advocate?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/delete-advocate/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

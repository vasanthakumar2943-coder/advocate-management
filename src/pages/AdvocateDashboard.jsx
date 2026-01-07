import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import React from "react";

export default function AdvocateDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ CORRECT TOKEN
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please login again");
      setLoading(false);
      return;
    }

    fetchApps();
    // eslint-disable-next-line
  }, []);

  // ============================
  // FETCH ADVOCATE APPOINTMENTS
  // ============================
  const fetchApps = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://127.0.0.1:8000/api/appointments/my/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ IGNORE DUPLICATES
      const seen = new Set();
      const unique = [];

      res.data.forEach((a) => {
        if (!seen.has(a.id)) {
          seen.add(a.id);
          unique.push(a);
        }
      });

      setAppointments(unique);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to load appointments");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // APPROVE APPOINTMENT
  // ============================
  const approve = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/approve-appointment/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Appointment approved");
      fetchApps();
    } catch (err) {
      console.error(err);
      toast.error("Approval failed");
    }
  };

  // ============================
  // DELETE APPOINTMENT
  // ============================
  const remove = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/appointments/delete/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Appointment deleted");
      fetchApps();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="page">
      <h2>Advocate Dashboard</h2>

      <div className="card">
        <h3>Appointments</h3>

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.client}</td>
                  <td>{a.status}</td>
                  <td>
                    {a.status === "pending" && (
                      <>
                        <button
                          className="action-btn approve"
                          onClick={() => approve(a.id)}
                        >
                          Approve
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() => remove(a.id)}
                          style={{ marginLeft: "8px" }}
                        >
                          Delete
                        </button>
                      </>
                    )}

                    {a.status === "approved" && (
                      <>
                        <a
                          className="action-btn chat"
                          href={`/chat/${a.id}`}
                        >
                          Chat
                        </a>

                        <button
                          className="action-btn delete"
                          onClick={() => remove(a.id)}
                          style={{ marginLeft: "8px" }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

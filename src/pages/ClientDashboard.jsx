import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const [advocates, setAdvocates] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const adv = await axios.get(
        "http://127.0.0.1:8000/api/advocates/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apps = await axios.get(
        "http://127.0.0.1:8000/api/my-appointments/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdvocates(adv.data || []);
      setAppointments(apps.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/";
      } else {
        toast.error("Failed to load data");
      }
    }
  };

  const book = async (id) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/book-appointment/",
        {
          advocate_id: id,
          date: "2026-01-10",
          time: "10:00",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Appointment request sent");
      fetchData(); // 🔁 refresh status
    } catch (err) {
      toast.error("Failed to book appointment");
    }
  };

  return (
    <>
     

      <div className="page">
        <h2>Client Dashboard</h2>

        <div className="card">
          <h3>Available Advocates</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {advocates.length === 0 && (
                <tr>
                  <td colSpan="2">No advocates available</td>
                </tr>
              )}

              {advocates.map((a) => (
                <tr key={a.id}>
                  <td>{a.username}</td>
                  <td>
                    <button
                      className="action-btn approve"
                      onClick={() => book(a.id)}
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>My Appointments</h3>
          <table>
            <thead>
              <tr>
                <th>Advocate</th>
                <th>Status</th>
                <th>Chat</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="3">No appointments</td>
                </tr>
              )}

              {appointments.map((app) => (
                <tr key={app.id}>
                  <td>{app.advocate}</td>
                  <td>{app.status}</td>
                  <td>
                    {app.status === "approved" && (
                      <button
                        className="action-btn chat"
                        onClick={() => navigate(`/chat/${app.id}`)}
                      >
                        Chat
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

/* =====================================================
   AXIOS BASE CONFIG (FIXED – NO LOGIC CHANGE)
   ===================================================== */
const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
  withCredentials: false,
});

export default function ClientDashboard() {
  const [advocates, setAdvocates] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      toast.error("Please login again");
      window.location.href = "/login";
      return;
    }

    fetchData();
    // eslint-disable-next-line
  }, []);

  /* ===============================
     FETCH ADVOCATES + APPOINTMENTS
     =============================== */
  const fetchData = async () => {
    try {
      const advRes = await API.get("advocates/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const appRes = await API.get("client/my-appointments/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdvocates(advRes.data || []);
      setAppointments(appRes.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        toast.error("Failed to load data");
      }
    }
  };

  /* ===============================
     BOOK APPOINTMENT
     =============================== */
  const bookAppointment = async (id) => {
    try {
      await API.post(
        "client/book-appointment/",
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
      fetchData();
    } catch (err) {
      toast.error("Failed to book appointment");
    }
  };

  return (
    <>
      

      <div className="page">
        <h2>Client Dashboard</h2>

        {/* ===============================
            AVAILABLE ADVOCATES
           =============================== */}
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

              {advocates.map((adv) => (
                <tr key={adv.id}>
                  <td>{adv.username}</td>
                  <td>
                    <button
                      className="action-btn approve"
                      onClick={() => bookAppointment(adv.id)}
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===============================
            MY APPOINTMENTS
           =============================== */}
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

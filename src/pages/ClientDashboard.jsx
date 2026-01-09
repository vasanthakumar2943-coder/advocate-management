import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAdvocates();
  }, []);

  const loadAdvocates = async () => {
    try {
      const res = await API.get("approved-advocates/");
      setAdvocates(res.data);
    } catch (err) {
      console.error("Advocate load error:", err);
      toast.error("Failed to load advocates");
    } finally {
      setLoading(false);
    }
  };

  const bookAdvocate = async (advocateId) => {
    try {
      await API.post("appointments/", {
        advocate: advocateId,
      });
      toast.success("Request sent to advocate");
      loadAdvocates(); // 🔄 refresh status
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Booking failed");
    }
  };

  return (
    <div className="page">
      <h2>Available Advocates</h2>

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
              <td colSpan="2">Loading advocates...</td>
            </tr>
          )}

          {!loading && advocates.length === 0 && (
            <tr>
              <td colSpan="2">No advocates available</td>
            </tr>
          )}

          {advocates.map((a) => (
            <tr key={a.id}>
              <td>{a.username}</td>

              <td>
                {/* ✅ Book button ALWAYS visible */}
                <button
                  className="btn"
                  onClick={() => bookAdvocate(a.id)}
                >
                  Book
                </button>

                {/* 🔵 Chat button ONLY if backend says allowed */}
                {a.can_chat && (
                  <button
                    className="btn"
                    style={{ marginLeft: "10px" }}
                    onClick={() => navigate(`/chat/${a.id}`)}
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
  );
}

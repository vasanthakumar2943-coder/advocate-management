import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

export default function ClientDashboard() {
  const [advocates, setAdvocates] = useState([]);

  useEffect(() => {
    loadAdvocates();
  }, []);

  const loadAdvocates = async () => {
    try {
      const res = await API.get(
        "users/?role=advocate&status=approved"
      );
      setAdvocates(res.data);
    } catch (err) {
      toast.error("Failed to load advocates");
    }
  };

  const bookAdvocate = async (advocateId) => {
    try {
      await API.post("appointments/", {
        advocate: advocateId,
      });
      toast.success("Request sent to advocate");
    } catch {
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
                  className="btn"
                  onClick={() => bookAdvocate(a.id)}
                >
                  Book
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

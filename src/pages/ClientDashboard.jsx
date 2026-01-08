import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ClientDashboard() {
  const [advocates, setAdvocates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdvocates();
  }, []);

  const fetchAdvocates = async () => {
    try {
      const res = await API.get("users/?role=advocate&status=approved");
      setAdvocates(res.data);
    } catch {
      toast.error("Failed to load advocates");
    }
  };

  const bookAdvocate = async (id) => {
    try {
      await API.post("appointments/", { advocate: id });
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

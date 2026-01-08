import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
});

export default function ClientDashboard() {
  const [advocates, setAdvocates] = useState([]);
  const navigate = useNavigate();

  const auth = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  };

  useEffect(() => {
    API.get("advocates/", auth).then((res) => setAdvocates(res.data));
  }, []);

  return (
    <div className="table-box">
      <h2>Available Advocates</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Chat</th>
          </tr>
        </thead>

        <tbody>
          {advocates.map((a) => (
            <tr key={a.id}>
              <td>{a.username}</td>
              <td>
                <button onClick={() => navigate(`/chat/${a.id}`)}>
                  Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

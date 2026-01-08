import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
});

export default function AdvocateDashboard() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  const auth = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  };

  useEffect(() => {
    API.get("advocate/clients/", auth).then((res) => setClients(res.data));
  }, []);

  return (
    <div className="table-box">
      <h2>Client Requests</h2>

      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Chat</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.username}</td>
              <td>
                <button onClick={() => navigate(`/chat/${c.id}`)}>
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

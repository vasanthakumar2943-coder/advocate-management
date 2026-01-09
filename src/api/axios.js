import axios from "axios";

const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Attach token dynamically (CORRECT WAY)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access"); // 👈 ACCESS token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// optional: auto attach token if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

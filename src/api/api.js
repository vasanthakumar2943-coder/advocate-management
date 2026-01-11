import axios from "axios";

// ===============================
// AXIOS INSTANCE
// ===============================
const API = axios.create({
  // ❌ OLD (WRONG):
  // baseURL: "https://web-production-d827.up.railway.app/api/auth/",

  // ✅ FIXED (CORRECT – BACKEND MATCH)
  baseURL: "https://web-production-d827.up.railway.app/api/",

  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // prevent infinite loading
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default API;

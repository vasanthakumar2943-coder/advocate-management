import axios from "axios";

/* =====================================================
   AXIOS GLOBAL INSTANCE (RAILWAY BACKEND)
   ===================================================== */

const api = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================================
   REQUEST INTERCEPTOR – ADD JWT TOKEN
   ===================================================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================================
   RESPONSE INTERCEPTOR – HANDLE 401
   ===================================================== */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

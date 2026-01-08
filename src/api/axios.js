import axios from "axios";

const api = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
  withCredentials: false,
});

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

export default api;

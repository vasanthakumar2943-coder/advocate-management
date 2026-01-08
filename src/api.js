import axios from "axios";

const api = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
});

export default api;

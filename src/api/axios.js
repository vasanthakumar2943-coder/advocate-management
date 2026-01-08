import axios from "axios";

const API = axios.create({
  baseURL: "https://web-production-d827.up.railway.app/api/",
});

export default API;

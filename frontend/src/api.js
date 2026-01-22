import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

export default api;

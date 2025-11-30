// src/lib/axios.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject latest token dynamically before each request
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        if (config.headers && config.headers["Authorization"]) {
          delete config.headers["Authorization"];
        }
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

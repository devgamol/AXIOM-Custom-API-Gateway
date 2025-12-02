// src/lib/axios.js
import axios from "axios";

// Read from .env (VITE_API_BASE must be defined)
const BASE_URL = import.meta.env.VITE_API_BASE || "https://axiom-custom-api-gateway.onrender.com";

console.log("AXIOS BASE URL =>", BASE_URL); // DEBUG LINE (KEEP FOR NOW)

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

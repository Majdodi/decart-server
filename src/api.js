// src/api.js
import axios from "axios";

/* ============================================
   🌍 GLOBAL API BASE URL — Production Ready
   ============================================ */

// 🟢 إذا الموقع شغّال على localhost → استخدم الـ backend المحلي
// 🔵 إذا شغّال على decart.ps → استخدم سيرفر Render تلقائي

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://decart-server.onrender.com/api");

// Debugging
console.log(
  "%c🌐 API BASE URL =>",
  "color: ; font-size:14px",
  API_BASE_URL
);

/* ============================================
   🛠 Create Global Axios Instance
   ============================================ */
console.log("🔥 API BASE URL =>", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

/* ============================================
   🔐 Automatically Attach Authorization Header
   ============================================ */

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("📌 Axios → Auth Header:", config.headers.Authorization);

  return config;
});

/* ============================================
   ❗ Global Error Handler (Production Style)
   ============================================ */

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(
      "❌ API Error:",
      err?.response?.data || err.message || "Unknown error"
    );
    return Promise.reject(err);
  }
);



export default api;

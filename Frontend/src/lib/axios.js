// lib/axios.js
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? "http://localhost:5001/api" : "/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 🔥 required for cookie-based auth
});

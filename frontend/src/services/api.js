import axios from "axios";

// 1. Prioritize the .env variable, fallback to localhost for safety
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // 2. Add a timeout to prevent the UI from hanging if the server is down
  timeout: 10000,
});

// 3. Optional: Add an interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error(
        "Network Error: Is the backend running at " + BASE_URL + "?",
      );
    }
    return Promise.reject(error);
  },
);

export default api;

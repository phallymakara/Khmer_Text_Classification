import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const classifyText = async (content) => {
  const response = await api.post(
    `/classify?content=${encodeURIComponent(content)}`,
  );
  return response.data;
};

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 5000,
});

export const fetchMetrics = async () => {
  const res = await api.get("/metrics");
  return res.data;
};

export const startSimulation = async () => {
  const res = await api.post("/start");
  return res.data;
};

export const stopSimulation = async () => {
  const res = await api.post("/stop");
  return res.data;
};

export const addProcess = async (payload) => {
  const res = await api.post("/add_process", payload);
  return res.data;
};

export default api;


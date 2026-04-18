import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/me");

export const uploadResume = (formData) =>
  api.post("/resume/upload", formData, {
    headers: { "Content-Type": undefined },
  });
export const pasteResume = (text) => api.post("/resume/paste", { text });
export const getMyResume = () => api.get("/resume/me");

export const findMatches = (preferences) =>
  api.post("/jobs/match", preferences);
export const getLatestMatches = () => api.get("/jobs/latest");
export const saveJob = (jobId) => api.post(`/jobs/save/${jobId}`);
export const getSavedJobs = () => api.get("/jobs/saved");

export const getApplications = () => api.get("/applications");
export const createApplication = (data) => api.post("/applications", data);
export const updateApplication = (id, data) =>
  api.put(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

export default api;

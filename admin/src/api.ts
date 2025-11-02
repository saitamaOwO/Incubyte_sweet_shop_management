import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  loginAdmin: (data: { email: string; password: string }) => api.post("/auth/admin-login", data),
}

export const sweetsAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/sweets?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get(`/sweets/${id}`),
  create: (data: any) => api.post("/sweets", data),
  update: (id: string, data: any) => api.put(`/sweets/${id}`, data),
  delete: (id: string) => api.delete(`/sweets/${id}`),
}

export default api

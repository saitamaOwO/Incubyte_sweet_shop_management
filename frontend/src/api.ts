import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
}

export const sweetsAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/sweets?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get(`/sweets/${id}`),
  search: (query: string, category?: string) => api.get(`/sweets/search`, { params: { query, category } }),
  create: (data: any) => api.post("/sweets", data),
  update: (id: string, data: any) => api.put(`/sweets/${id}`, data),
  delete: (id: string) => api.delete(`/sweets/${id}`),
}

export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (data: { sweetId: string; quantity: number }) => api.post("/cart/add", data),
  updateCartItem: (itemId: string, data: { quantity: number }) => api.put(`/cart/update/${itemId}`, data),
  removeFromCart: (itemId: string) => api.delete(`/cart/remove/${itemId}`),
  clearCart: () => api.delete("/cart/clear"),
}

export const ordersAPI = {
  create: () => api.post("/orders"),
  getAll: (page = 1, limit = 10) => api.get(`/orders?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get(`/orders/${id}`),
}

export default api

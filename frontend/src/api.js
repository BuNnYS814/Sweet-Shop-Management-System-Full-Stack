import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (email, password) => {
    const response = await api.post('/api/auth/register', { email, password });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
};

export const sweetsAPI = {
  getAll: async () => {
    const response = await api.get('/api/sweets');
    return response.data;
  },
  create: async (sweet) => {
    const response = await api.post('/api/sweets', sweet);
    return response.data;
  },
  update: async (id, sweet) => {
    const response = await api.put(`/api/sweets/${id}`, sweet);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/sweets/${id}`);
    return response.data;
  },
  purchase: async (id, quantity = 1) => {
    const response = await api.post(`/api/sweets/${id}/purchase`, { quantity });
    return response.data;
  },
};

export default api;


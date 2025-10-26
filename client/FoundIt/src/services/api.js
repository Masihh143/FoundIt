import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/user/register', userData),
  login: (credentials) => api.post('/user/login', credentials),
  getProfile: () => api.get('/user/profile'),
};

// Lost Items API
export const lostAPI = {
  getAll: () => api.get('/lost'),
  getById: (id) => api.get(`/lost/${id}`),
  create: (formData) => api.post('/lost/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Found Items API
export const foundAPI = {
  getAll: () => api.get('/found'),
  getById: (id) => api.get(`/found/${id}`),
  create: (formData) => api.post('/found/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;

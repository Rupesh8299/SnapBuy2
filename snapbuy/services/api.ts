import axios from 'axios';

const BASE_URL = 'https://fakestoreapi.com';

// Configure axios defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
};

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  signup: (userData: { 
    name: string, 
    email: string, 
    password: string 
  }) => api.post('/auth/register', userData),
};

export default api;
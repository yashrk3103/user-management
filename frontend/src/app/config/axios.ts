import axios from 'axios';

const normalizeApiBaseUrl = (url: string) => {
  const trimmed = url.replace(/\/+$/, '');
  return /\/api($|\/)/.test(trimmed) ? trimmed : `${trimmed}/api`;
};

const runtimeEnv = (import.meta as { env?: Record<string, string | undefined> }).env;
const apiBaseUrl = normalizeApiBaseUrl(runtimeEnv?.VITE_API_BASE_URL || 'http://localhost:5000/api');

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
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

// Response interceptor
axiosInstance.interceptors.response.use(
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

export default axiosInstance;

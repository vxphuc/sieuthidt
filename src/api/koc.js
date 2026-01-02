// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: "https://chatapi.io.vn" || 'https://sieuthidt.io.vn',
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default api;

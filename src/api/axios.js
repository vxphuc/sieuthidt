import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_SIEU_THI_API,
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
import axios from 'axios';

const api = axios.create({
<<<<<<< Updated upstream
  baseURL: process.env.REACT_APP_SIEU_THI_API,
=======
  baseURL: "https://sieuthidt.io.vn" || 'https://sieuthidt.io.vn',
>>>>>>> Stashed changes
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
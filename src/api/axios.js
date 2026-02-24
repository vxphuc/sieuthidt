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
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      if (error.response.data.detail === "Could not validate credentials" || error.response.data.detail === 404) {
        localStorage.removeItem('authToken'); 
        
        alert("Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!"); 
        window.location.href = '/dang-nhap'; 
      }
    }
    return Promise.reject(error);
  }
);
export default api;
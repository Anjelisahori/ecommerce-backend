// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8085/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("➡ Enviando token:", token);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;

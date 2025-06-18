// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8888', // change this if your backend URL is different
});

// Attach token to every request if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

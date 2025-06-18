// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8888', // Your backend server URL
});

export default API;

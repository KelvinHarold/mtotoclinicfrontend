// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Badilisha na URL ya backend yako
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

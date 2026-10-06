import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

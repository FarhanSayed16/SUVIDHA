import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Assuming the admin is hosted on the same network or configured globally
const API_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to inject JWT Token dynamically into every protected route call
api.interceptors.request.use((config) => {
    const rawStorage = localStorage.getItem('admin-auth-storage');
    if (rawStorage) {
        try {
            const parsed = JSON.parse(rawStorage);
            const token = parsed.state?.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.error('Failed to parse admin auth store', e);
        }
    }
    return config;
});

export default api;

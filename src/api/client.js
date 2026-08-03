import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/';

// Plain axios instance for refresh (avoids interceptor loops)
const plainAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token refresh queue (prevents multiple simultaneous refresh requests)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Request interceptor — attach current access token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 with auto-refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already tried refreshing this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If another request is already refreshing, queue this one
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint (adjust URL if yours is different)
        const rs = await plainAxios.post('/token/refresh/', {
          refresh: refreshToken,
        });

        const { access, refresh } = rs.data;

        // Update Zustand store with BOTH new tokens
        useAuthStore.getState().setTokens(access, refresh);

        // Update default header for future requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;

        // Retry all queued requests
        processQueue(null, access);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (_error) {
        processQueue(_error, null);
        
        // Refresh failed — token expired or blacklisted
        useAuthStore.getState().logout();
        
        // Redirect to login (optional — you can also just let the component handle it)
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(_error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
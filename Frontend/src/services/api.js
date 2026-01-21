import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nxtcompass06.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90s to tolerate Render.com cold start (~30-60s); avoids fail-then-retry when server is waking
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth tokens and logging
api.interceptors.request.use(
  (config) => {
    console.log('🔵 [API Request] Starting request...');
    console.log('🔵 [API Request] URL:', config.baseURL + config.url);
    console.log('🔵 [API Request] Method:', config.method);
    console.log('🔵 [API Request] Headers:', config.headers);
    console.log('🔵 [API Request] Data:', config.data);

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 [API Request] Auth token added');
    }
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Log responses and errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API Response] Success:', response.status, response.statusText);
    console.log('✅ [API Response] Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ [API Response Error]:', error);
    if (error.response) {
      console.error('❌ [API Response Error] Status:', error.response.status);
      console.error('❌ [API Response Error] Data:', error.response.data);
      console.error('❌ [API Response Error] Headers:', error.response.headers);
    } else if (error.request) {
      console.error('❌ [API Response Error] No response received');
      console.error('❌ [API Response Error] Request:', error.request);
    } else {
      console.error('❌ [API Response Error] Message:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Fire-and-forget request to /health to wake Render.com before first chat request.
 * Call when Mentor UI mounts to reduce cold-start failures on first message.
 */
export const wakeBackend = () => {
  try {
    const origin = new URL(API_BASE_URL).origin;
    fetch(`${origin}/health`).catch(() => {});
  } catch { /* ignore URL/fetch errors */ }
};

export default api;

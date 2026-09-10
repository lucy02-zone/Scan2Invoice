import axios from 'axios';
import { ROUTES } from '../utils/constants.js';

const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 3000;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 60000, // 60s — accounts for Render free-tier cold-start wake-up time
  headers: {
    'Content-Type': 'application/json'
  }
});

function getToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('scan2invoice_token');
}

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Track retry count on the config object
    config._retryCount = config._retryCount ?? 0;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const config = error?.config;

    // Auto-retry on network errors or 5xx (backend waking up / transient failure)
    const isRetryable =
      config &&
      !error.response && // network / timeout error
      config._retryCount < MAX_RETRIES;

    if (isRetryable) {
      config._retryCount += 1;
      const delay = RETRY_DELAY_MS * config._retryCount;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    // 401 — clear session and redirect to login
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('scan2invoice_token');
      localStorage.removeItem('scan2invoice_user');
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.href = ROUTES.LOGIN;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

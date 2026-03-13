import axios from 'axios';
import type { ApiError } from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data;
    const apiError: ApiError = {
      message: data?.error || data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      errors: data?.details?.map((d: any) => ({
        field: d.field,
        message: d.message
      })),
    };

    if (import.meta.env.DEV) {
      console.error('[API Error]:', apiError);
    }

    return Promise.reject(apiError);
  }
);

export default api;

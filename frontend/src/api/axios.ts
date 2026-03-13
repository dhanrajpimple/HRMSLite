import axios from 'axios';
import type { ApiError } from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

interface ApiErrorDetail {
  field: string;
  message: string;
}

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data as Record<string, unknown> | undefined;
    const apiError: ApiError = {
      message:
        (data?.error as string) ||
        (data?.message as string) ||
        error.message ||
        'An unexpected error occurred',
      status: error.response?.status,
      errors: (data?.details as ApiErrorDetail[] | undefined)?.map(
        (d: ApiErrorDetail) => ({
          field: d.field,
          message: d.message,
        })
      ),
    };

    if (import.meta.env.DEV) {
      console.error('[API Error]:', apiError);
    }

    return Promise.reject(apiError);
  }
);

export default api;

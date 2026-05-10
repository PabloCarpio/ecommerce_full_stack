import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const api = {
  get: <T>(url: string) => apiClient.get<T>(url).then((r) => r.data),
  post: <T>(url: string, data?: unknown) => apiClient.post<T>(url, data).then((r) => r.data),
  patch: <T>(url: string, data?: unknown) => apiClient.patch<T>(url, data).then((r) => r.data),
  delete: <T>(url: string) => apiClient.delete<T>(url).then((r) => r.data),
};

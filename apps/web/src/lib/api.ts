import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

// Browser-side axios client (used in client components)
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
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

// The NestJS TransformInterceptor wraps all responses in { data: <payload> }
// Axios stores the HTTP body in r.data, so we must unwrap r.data.data
export const api = {
  get: <T>(url: string) =>
    apiClient.get<{ data: T }>(url).then((r) => r.data.data),
  post: <T>(url: string, data?: unknown) =>
    apiClient.post<{ data: T }>(url, data).then((r) => r.data.data),
  patch: <T>(url: string, data?: unknown) =>
    apiClient.patch<{ data: T }>(url, data).then((r) => r.data.data),
  delete: <T>(url: string) =>
    apiClient.delete<{ data: T }>(url).then((r) => r.data.data),
};

// Server-side fetch helper (for Server Components / SSR)
// Uses native fetch with a 5-second AbortController timeout
export async function serverFetch<T>(
  path: string,
  token?: string,
): Promise<T | null> {
  try {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: ctrl.signal,
      next: { revalidate: 60 },
    });
    clearTimeout(id);
    if (!res.ok) return null;
    const json = (await res.json()) as { data: T };
    return json.data;
  } catch {
    return null;
  }
}

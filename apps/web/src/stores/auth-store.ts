import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: { id: string; email: string; role: string } | null;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: { id: string; email: string; role: string }) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (access, refresh) => {
        localStorage.setItem('accessToken', access);
        set({ accessToken: access, refreshToken: refresh });
      },
      setUser: (user) => set({ user }),
      logout: async () => {
        const { refreshToken } = get();
        try {
          await api.post('/auth/logout', { refreshToken });
        } catch {}
        localStorage.removeItem('accessToken');
        set({ accessToken: null, refreshToken: null, user: null });
      },
    }),
    { name: 'auth-storage' },
  ),
);
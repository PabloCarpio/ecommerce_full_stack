import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  hydrated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  setAuth: (access: string, refresh: string, user: User) => void;
  fetchProfile: () => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hydrated: false,
      setTokens: (access, refresh) => {
        if (typeof window !== 'undefined') localStorage.setItem('accessToken', access);
        set({ accessToken: access, refreshToken: refresh });
      },
      setUser: (user) => set({ user }),
      setAuth: (access, refresh, user) => {
        if (typeof window !== 'undefined') localStorage.setItem('accessToken', access);
        set({ accessToken: access, refreshToken: refresh, user });

        import('../stores/cart-store').then(({ useCartStore }) => {
          useCartStore.getState().mergeGuestCart(user.id);
        }).catch(() => {});
      },
      fetchProfile: async () => {
        try {
          const user = await api.get<User>('/auth/me');
          set({ user });
          return user;
        } catch {
          const { refreshToken } = get();
          if (refreshToken) {
            try {
              const data = await api.post<{ accessToken: string; refreshToken: string; user: User }>('/auth/refresh', { refreshToken });
              if (typeof window !== 'undefined') localStorage.setItem('accessToken', data.accessToken);
              set({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user });
              return data.user;
            } catch {
              set({ accessToken: null, refreshToken: null, user: null });
              if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
              return null;
            }
          }
          return null;
        }
      },
      logout: async () => {
        const { refreshToken } = get();
        try {
          await api.post('/auth/logout', { refreshToken });
        } catch {}
        if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
        set({ accessToken: null, refreshToken: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
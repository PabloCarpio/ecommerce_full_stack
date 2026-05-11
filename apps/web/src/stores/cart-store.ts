import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartResponse {
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    product?: {
      id: string;
      name: string;
      slug: string;
      price: number;
      images: string[];
    };
  }>;
  total: number;
  itemCount: number;
}

interface CartState {
  items: CartItem[];
  guestId: string;
  hydrated: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  mergeGuestCart: (userId: string) => Promise<void>;
  syncFromServer: () => Promise<void>;
}

function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem('guestId');
  if (existing) return existing;
  const id = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  localStorage.setItem('guestId', id);
  return id;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      guestId: '',
      hydrated: false,

      addItem: async (item) => {
        const state = get();
        const existing = state.items.find((i) => i.productId === item.productId);

        if (existing) {
          set({
            items: state.items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({ items: [...state.items, { ...item, quantity: 1 }] });
        }

        try {
          const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          const guestId = state.guestId || getOrCreateGuestId();
          if (!state.guestId) set({ guestId });

          const url = accessToken ? '/cart/items' : `/cart/items?guestId=${encodeURIComponent(guestId)}`;
          await api.post(url, { productId: item.productId, quantity: existing ? existing.quantity + 1 : 1 });
        } catch {}
      },

      removeItem: async (productId) => {
        const state = get();
        set({ items: state.items.filter((i) => i.productId !== productId) });

        try {
          const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          const { guestId } = state;
          const url = accessToken ? '/cart/items' : `/cart/items?guestId=${encodeURIComponent(guestId)}`;
          const cart = await api.get<CartResponse>(url);

          const item = cart.items.find((i) => i.productId === productId);
          if (item) {
            await api.delete(`/cart/items/${item.id}`);
          }
        } catch {}
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity < 1) {
          return get().removeItem(productId);
        }

        const state = get();
        set({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        });

        try {
          const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          const { guestId } = state;
          const url = accessToken ? '/cart/items' : `/cart/items?guestId=${encodeURIComponent(guestId)}`;
          const cart = await api.get<CartResponse>(url);

          const item = cart.items.find((i) => i.productId === productId);
          if (item) {
            await api.patch(`/cart/items/${item.id}`, { quantity });
          }
        } catch {}
      },

      clearCart: () => set({ items: [] }),

      mergeGuestCart: async (userId) => {
        const { guestId } = get();
        if (guestId) {
          try {
            await api.post('/cart/merge', { guestId });
            if (typeof window !== 'undefined') localStorage.removeItem('guestId');
          } catch {}
        }
        await get().syncFromServer();
      },

      syncFromServer: async () => {
        try {
          const cart = await api.get<CartResponse>('/cart');
          set({
            items: cart.items.map((item) => ({
              productId: item.productId,
              name: item.product?.name ?? 'Product',
              slug: item.product?.slug ?? '',
              price: item.product?.price ?? 0,
              image: item.product?.images?.[0] ?? 'https://placehold.co/400x250?text=Product',
              quantity: item.quantity,
            })),
          });
        } catch {}
      },
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
          if (!state.guestId) {
            state.guestId = getOrCreateGuestId();
          }
        }
      },
    },
  ),
);

export const useCartTotal = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0));
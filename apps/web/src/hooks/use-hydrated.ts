'use client';

import { useStore } from 'zustand';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';

export function useHydrated() {
  const hydrated = useStore(useAuthStore, (s) => s.hydrated);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (hydrated) setIsReady(true);
  }, [hydrated]);

  return isReady;
}
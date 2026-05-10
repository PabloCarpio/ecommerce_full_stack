'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Sidebar } from '@/components/buyer/sidebar';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'BUYER') {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'BUYER') {
    return <div className="container py-16 text-center">Redirecting...</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <Sidebar />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

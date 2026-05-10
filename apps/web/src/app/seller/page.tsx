'use client';

import { useEffect, useState } from 'react';
import { BarChart3, DollarSign, Package, ShoppingCart } from 'lucide-react';
import { KPICard } from '@/components/seller/kpi-card';
import { api } from '@/lib/api';

interface SellerAnalytics {
  storeName: string;
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  averageOrderValue: number;
}

export default function SellerDashboard() {
  const [analytics, setAnalytics] = useState<SellerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<SellerAnalytics>('/analytics/seller')
      .then(setAnalytics)
      .catch(() => setAnalytics({ storeName: 'Your Store', totalRevenue: 0, totalSales: 0, totalProducts: 0, averageOrderValue: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{analytics?.storeName ?? 'Dashboard'}</h1>
        <p className="text-muted-foreground mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value={`$${analytics?.totalRevenue.toFixed(2) ?? 0}`} icon={DollarSign} trend={{ value: 12, positive: true }} />
        <KPICard title="Total Sales" value={analytics?.totalSales ?? 0} icon={ShoppingCart} trend={{ value: 8, positive: true }} />
        <KPICard title="Products" value={analytics?.totalProducts ?? 0} icon={Package} />
        <KPICard title="Avg Order Value" value={`$${analytics?.averageOrderValue.toFixed(2) ?? 0}`} icon={BarChart3} />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="font-semibold text-lg mb-4">Recent Sales</h2>
        <p className="text-muted-foreground text-sm">No recent sales to display.</p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { KPICard } from '@/components/seller/kpi-card';
import { DollarSign, ShoppingCart, Users, Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { api } from '@/lib/api';

interface PlatformAnalytics {
  totalRevenue: number;
  totalTransactions: number;
  activeSellers: number;
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<PlatformAnalytics>('/analytics/platform')
      .then(setAnalytics)
      .catch(() =>
        setAnalytics({ totalRevenue: 0, totalTransactions: 0, activeSellers: 0, totalProducts: 0, totalUsers: 0, totalOrders: 0 }),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">Global metrics and performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value={`$${analytics?.totalRevenue.toFixed(2) ?? 0}`} icon={DollarSign} trend={{ value: 15, positive: true }} />
        <KPICard title="Total Orders" value={analytics?.totalOrders ?? 0} icon={ShoppingCart} trend={{ value: 8, positive: true }} />
        <KPICard title="Active Sellers" value={analytics?.activeSellers ?? 0} icon={Store} />
        <KPICard title="Total Users" value={analytics?.totalUsers ?? 0} icon={Users} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/sellers"><Button variant="outline" className="w-full">Manage Sellers</Button></Link>
              <Link href="/admin/products"><Button variant="outline" className="w-full">Moderate Products</Button></Link>
              <Link href="/admin/users"><Button variant="outline" className="w-full">Manage Users</Button></Link>
              <Link href="/admin/categories"><Button variant="outline" className="w-full">Edit Categories</Button></Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Platform Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Products</span>
                <span className="font-semibold">{analytics?.totalProducts ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Transactions</span>
                <span className="font-semibold">{analytics?.totalTransactions ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Revenue/Order</span>
                <span className="font-semibold">
                  ${analytics && analytics.totalOrders > 0 ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

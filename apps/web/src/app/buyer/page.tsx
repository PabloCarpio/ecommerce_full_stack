'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { KPICard } from '@/components/seller/kpi-card';
import { ShoppingBag, BookOpen, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{ product: { name: string; slug: string } }>;
}

export default function BuyerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Order[]>('/orders')
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-1">Your learning dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard title="Total Spent" value={`$${totalSpent.toFixed(2)}`} icon={DollarSign} />
        <KPICard title="Orders" value={orders.length} icon={ShoppingBag} />
        <KPICard title="Products Owned" value={orders.reduce((s, o) => s + o.items.length, 0)} icon={BookOpen} />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Orders</h2>
            <Link href="/buyer/orders">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No orders yet. Start exploring products!</p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{order.items.map((i) => i.product.name).join(', ')}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                    <span className="text-xs text-muted-foreground">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

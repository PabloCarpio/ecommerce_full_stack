'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Ban, Check, Eye } from 'lucide-react';

interface Seller {
  id: string;
  name: string;
  email: string;
  products: number;
  revenue: number;
  status: 'active' | 'suspended';
}

export default function AdminSellers() {
  const { toast } = useToast();
  const [sellers, setSellers] = useState<Seller[]>([
    { id: '1', name: 'Acme Digital Store', email: 'seller@ecommerce.local', products: 12, revenue: 4500, status: 'active' },
    { id: '2', name: 'Pixel Studio', email: 'designer@ecommerce.local', products: 6, revenue: 1200, status: 'active' },
    { id: '3', name: 'Code Academy', email: 'code@ecommerce.local', products: 3, revenue: 300, status: 'suspended' },
  ]);

  const toggleStatus = (id: string) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s)),
    );
    toast({ title: 'Seller status updated' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seller Management</h1>
        <p className="text-muted-foreground mt-1">{sellers.length} registered sellers</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="text-left p-4 font-medium">Store</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Products</th>
                <th className="text-left p-4 font-medium">Revenue</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4 font-medium">{seller.name}</td>
                  <td className="p-4 text-sm">{seller.email}</td>
                  <td className="p-4">{seller.products}</td>
                  <td className="p-4 font-semibold">${seller.revenue.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        seller.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {seller.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleStatus(seller.id)}>
                        {seller.status === 'active' ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';


interface Sale {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: string;
  date: string;
}

export default function SellerSales() {
  const [sales, setSales] = useState<Sale[]>([
    { id: '1', productName: 'Next.js Masterclass', quantity: 1, unitPrice: 49.99, total: 49.99, status: 'PAID', date: '2024-03-15' },
    { id: '2', productName: 'NestJS Guide', quantity: 2, unitPrice: 59.99, total: 119.98, status: 'COMPLETED', date: '2024-03-14' },
    { id: '3', productName: 'TypeScript Deep Dive', quantity: 1, unitPrice: 39.99, total: 39.99, status: 'PENDING', date: '2024-03-13' },
  ]);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales History</h1>
        <p className="text-muted-foreground mt-1">Total revenue: ${totalRevenue.toFixed(2)}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Qty</th>
                <th className="text-left p-4 font-medium">Price</th>
                <th className="text-left p-4 font-medium">Total</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4 font-medium">{sale.productName}</td>
                  <td className="p-4">{sale.quantity}</td>
                  <td className="p-4">${sale.unitPrice.toFixed(2)}</td>
                  <td className="p-4 font-semibold">${sale.total.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        sale.status === 'PAID'
                          ? 'bg-green-500/10 text-green-500'
                          : sale.status === 'COMPLETED'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{sale.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {sales.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No sales yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

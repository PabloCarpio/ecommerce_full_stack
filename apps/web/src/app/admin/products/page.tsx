'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, Trash2, Ban } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  slug: string;
  name: string;
  sellerName: string;
  price: number;
  isPublished: boolean;
  image: string;
}

export default function AdminProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    { id: '1', slug: 'nextjs-masterclass', name: 'Next.js Masterclass', sellerName: 'Acme Digital Store', price: 49.99, isPublished: true, image: 'https://placehold.co/100x60' },
    { id: '2', slug: 'nestjs-guide', name: 'NestJS Guide', sellerName: 'Acme Digital Store', price: 59.99, isPublished: true, image: 'https://placehold.co/100x60' },
    { id: '3', slug: 'figma-to-code', name: 'Figma to Code', sellerName: 'Pixel Studio', price: 34.99, isPublished: false, image: 'https://placehold.co/100x60' },
  ]);

  const togglePublish = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p)),
    );
    toast({ title: 'Product status updated' });
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: 'Product removed' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Moderation</h1>
        <p className="text-muted-foreground mt-1">{products.length} products across all stores</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Seller</th>
                <th className="text-left p-4 font-medium">Price</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-16 rounded overflow-hidden shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <span className="font-medium truncate">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{product.sellerName}</td>
                  <td className="p-4 font-semibold">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}
                    >
                      {product.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/products/${product.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(product.id)}>
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
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

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  isPublished: boolean;
  createdAt: string;
}

export default function SellerProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    { id: '1', slug: 'nextjs-masterclass', name: 'Next.js Masterclass', description: 'Build production apps', price: 49.99, images: ['https://placehold.co/100x60'], isPublished: true, createdAt: '2024-01-15' },
    { id: '2', slug: 'nestjs-guide', name: 'NestJS Guide', description: 'Enterprise patterns', price: 59.99, images: ['https://placehold.co/100x60'], isPublished: false, createdAt: '2024-02-20' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setLoading(true);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: 'Product deleted' });
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (product: Product) => {
    try {
      await api.patch(`/products/${product.id}`, { isPublished: !product.isPublished });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isPublished: !p.isPublished } : p)),
      );
      toast({ title: product.isPublished ? 'Product unpublished' : 'Product published' });
    } catch {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">{products.length} products</p>
        </div>
        <Link href="/seller/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="relative h-16 w-24 rounded overflow-hidden shrink-0">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      product.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}
                  >
                    {product.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                <p className="text-sm font-medium mt-1">${product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/products/${product.slug}`} target="_blank">
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/seller/products/${product.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => togglePublish(product)}>
                  {product.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} disabled={loading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {products.length === 0 && (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No products yet. Create your first product!</p>
          </div>
        )}
      </div>
    </div>
  );
}

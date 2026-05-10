'use client';

import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/product-card';

export function ProductGrid() {
  const searchParams = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';

  // In production, this would fetch from the API
  const products = Array.from({ length: 12 }).map((_, i) => ({
    id: `prod-${i}`,
    slug: `product-${i}`,
    name: `${search ? search + ' ' : ''}Product ${i + 1}`,
    description: 'A comprehensive digital product with everything you need.',
    price: 19.99 + i * 5,
    image: `https://placehold.co/400x250?text=Product+${i + 1}`,
    sellerName: 'Acme Digital Store',
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}

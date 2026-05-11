'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Star, Clock } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { api } from '@/lib/api';

interface ProductData {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  seller?: { id: string; name: string };
  category?: { id: string; name: string; slug: string };
}

interface ProductDetailProps {
  slug: string;
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get<ProductData>(`/products/${slug}`)
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? `https://placehold.co/400x250?text=${encodeURIComponent(product.name)}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        <div className="lg:col-span-2">
          <div className="aspect-video bg-muted rounded-lg mb-6" />
          <div className="h-8 bg-muted rounded w-3/4 mb-4" />
          <div className="h-4 bg-muted rounded w-1/2 mb-2" />
          <div className="h-24 bg-muted rounded" />
        </div>
        <div className="lg:col-span-1">
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <a href="/products">Browse Products</a>
        </Button>
      </div>
    );
  }

  const imageSrc = product.images[0] ?? `https://placehold.co/800x450?text=${encodeURIComponent(product.name)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        {product.category && (
          <p className="text-sm text-muted-foreground mb-2">{product.category.name}</p>
        )}
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent className="p-6 space-y-4">
            <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>
            {product.seller && (
              <p className="text-sm text-muted-foreground">by {product.seller.name}</p>
            )}
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={added}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </Button>
            <div className="text-xs text-muted-foreground text-center">
              Instant digital delivery &bull; Lifetime access
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
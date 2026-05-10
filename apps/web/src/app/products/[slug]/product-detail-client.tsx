'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Star, Clock } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

interface ProductDetailProps {
  slug: string;
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const { addItem } = useCartStore();

  const product = {
    id: `prod-detail-${slug}`,
    slug,
    name: `${slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Masterclass`,
    description:
      'A comprehensive course covering everything you need to know. From beginner to advanced, this product includes video lessons, downloadable resources, and lifetime access.',
    price: 49.99,
    images: [`https://placehold.co/800x450?text=${encodeURIComponent(slug)}`],
    sellerName: 'Acme Digital Store',
    rating: 4.8,
    reviews: 124,
    students: 1200,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {product.rating} ({product.reviews} reviews)
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {product.students} students
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent className="p-6 space-y-4">
            <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">by {product.sellerName}</p>
            <Button
              className="w-full"
              size="lg"
              onClick={() =>
                addItem({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  image: product.images[0],
                })
              }
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
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
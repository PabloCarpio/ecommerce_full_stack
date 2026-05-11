'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/stores/cart-store';

interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sellerName: string;
}

export default function BuyerWishlist() {
  const { toast } = useToast();
  const addItem = useCartStore((s) => s.addItem);
  const [items, setItems] = useState<WishlistItem[]>([
    { id: '1', slug: 'nextjs-masterclass', name: 'Next.js Masterclass', description: 'Build production-ready apps', price: 49.99, image: 'https://placehold.co/400x250', sellerName: 'Acme Digital Store' },
    { id: '2', slug: 'typescript-deep-dive', name: 'TypeScript Deep Dive', description: 'Advanced types and generics', price: 39.99, image: 'https://placehold.co/400x250', sellerName: 'Pixel Studio' },
    { id: '3', slug: 'docker-for-devs', name: 'Docker for Developers', description: 'Containerize your workflow', price: 49.99, image: 'https://placehold.co/400x250', sellerName: 'Acme Digital Store' },
  ]);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast({ title: 'Removed from wishlist' });
  };

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      productId: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image: item.image,
    });
    toast({ title: 'Added to cart', description: `${item.name} has been added to your cart.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wishlist</h1>
        <p className="text-muted-foreground mt-1">{items.length} saved products</p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your wishlist is empty. Save products you love!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-video">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <CardContent className="p-4">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{item.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{item.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                  <Button size="sm" onClick={() => handleAddToCart(item)}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">by {item.sellerName}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
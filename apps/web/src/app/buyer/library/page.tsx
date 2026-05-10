'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BookOpen } from 'lucide-react';
import { api } from '@/lib/api';

interface Access {
  id: string;
  productId: string;
  grantedAt: string;
  product: { id: string; name: string; slug: string; images: string[]; description: string; fileUrl: string | null };
}

export default function BuyerLibrary() {
  const [products, setProducts] = useState<Access[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production: fetch from /buyer/access endpoint
    // For now, mock data
    setProducts([
      {
        id: '1',
        productId: 'prod-1',
        grantedAt: '2024-03-15',
        product: {
          id: 'prod-1',
          name: 'Next.js Masterclass',
          slug: 'nextjs-masterclass',
          images: ['https://placehold.co/400x250'],
          description: 'Build production-ready apps with the App Router.',
          fileUrl: 'https://example.com/download/nextjs.zip',
        },
      },
      {
        id: '2',
        productId: 'prod-2',
        grantedAt: '2024-03-10',
        product: {
          id: 'prod-2',
          name: 'NestJS Enterprise Patterns',
          slug: 'nestjs-enterprise',
          images: ['https://placehold.co/400x250'],
          description: 'Domain-Driven Design and Hexagonal Architecture.',
          fileUrl: null,
        },
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Library</h1>
        <p className="text-muted-foreground mt-1">{products.length} products owned</p>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Your library is empty. Purchase products to access them here.</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((access) => (
            <Card key={access.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Image src={access.product.images[0]} alt={access.product.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <Link href={`/products/${access.product.slug}`}>
                  <h3 className="font-semibold hover:text-primary transition-colors">{access.product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{access.product.description}</p>
                <div className="flex gap-2 mt-4">
                  {access.product.fileUrl && (
                    <Button size="sm" className="flex-1" asChild>
                      <a href={access.product.fileUrl} download>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link href={`/products/${access.product.slug}`}>View</Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Purchased {new Date(access.grantedAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

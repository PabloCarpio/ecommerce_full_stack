import { Suspense } from 'react';
import type { Metadata } from 'next';

export const experimental_ppr = true;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${name} — DigiStore`,
    description: `Browse ${name} and other premium digital products on DigiStore.`,
    openGraph: {
      title: `${name} — DigiStore`,
      description: `Browse ${name} and other premium digital products on DigiStore.`,
      type: 'article',
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="container py-8">
      <Suspense
        fallback={
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
        }
      >
        <ProductDetail slug={slug} />
      </Suspense>
    </div>
  );
}

import { ProductDetail } from './product-detail-client';
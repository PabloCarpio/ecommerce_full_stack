import { Suspense } from 'react';
import { ProductGrid } from '@/app/products/product-grid';

export const metadata = {
  title: 'Search — DigiStore',
  description: 'Search results for digital products.',
};

export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-8">
        Showing results for &quot;{searchParams.q}&quot;
      </p>
      <Suspense fallback={<p>Loading...</p>}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}

import { Suspense } from 'react';
import { ProductGrid } from './product-grid';
import { ProductFilters } from './product-filters';

export const metadata = {
  title: 'Products — DigiStore',
  description: 'Browse all digital products, courses, and templates.',
};

export default function ProductsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <ProductFilters />
        </aside>
        <div className="flex-1">
          <Suspense fallback={<p>Loading...</p>}>
            <ProductGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

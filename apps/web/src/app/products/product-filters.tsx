'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') ?? '');

  useEffect(() => {
    api.get<Category[]>('/categories')
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategory) {
      params.set('categoryId', selectedCategory);
    } else {
      params.delete('categoryId');
    }
    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategory('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categoryId');
    params.delete('minPrice');
    params.delete('maxPrice');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => setSelectedCategory('')}
              className="accent-primary"
            />
            All
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.id}
                onChange={() => setSelectedCategory(cat.id)}
                className="accent-primary"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex gap-2">
          <Input placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type="number" min="0" />
          <Input placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="number" min="0" />
        </div>
      </div>

      <div className="space-y-2">
        <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" className="w-full" onClick={clearFilters}>Clear Filters</Button>
      </div>
    </div>
  );
}
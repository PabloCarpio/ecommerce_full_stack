'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const categories = [
  'Development', 'Design', 'Business', 'Marketing',
  'Photography', 'Music', 'Health & Fitness', 'Lifestyle',
];

export function ProductFilters() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
                className="accent-primary"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex gap-2">
          <Input placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type="number" />
          <Input placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="number" />
        </div>
      </div>

      <Button className="w-full">Apply Filters</Button>
    </div>
  );
}

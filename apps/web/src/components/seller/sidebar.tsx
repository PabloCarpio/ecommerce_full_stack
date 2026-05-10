'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Package, ShoppingCart, Settings, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/seller', label: 'Dashboard', icon: BarChart3 },
  { href: '/seller/products', label: 'Products', icon: Package },
  { href: '/seller/sales', label: 'Sales', icon: ShoppingCart },
  { href: '/seller/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      <div className="flex items-center gap-2 px-3 py-2 mb-4">
        <Store className="h-5 w-5 text-primary" />
        <span className="font-semibold">Seller Portal</span>
      </div>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            pathname === item.href
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

import Link from 'next/link';
import { ArrowRight, BookOpen, Code, Palette, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { serverFetch } from '@/lib/api';

const features = [
  { icon: BookOpen, title: 'Premium Courses', desc: 'Expert-led video courses and tutorials' },
  { icon: Code, title: 'Dev Resources', desc: 'Templates, boilerplates, and starter kits' },
  { icon: Palette, title: 'Design Assets', desc: 'UI kits, icons, and design systems' },
  { icon: TrendingUp, title: 'Business Tools', desc: 'Playbooks, frameworks, and analytics' },
];

export default async function HomePage() {
  let featuredProducts: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    seller?: { id: string; name: string };
  }> = [];

  try {
    const data = await serverFetch<{
      items?: Array<{
        id: string;
        slug: string;
        name: string;
        description: string;
        price: number;
        images: string[];
        seller?: { id: string; name: string };
      }>;
    }>('/products?limit=8&sortOrder=desc');
    featuredProducts = data?.items ?? [];
  } catch {
    featuredProducts = Array.from({ length: 8 }).map((_, i) => ({
      id: `prod-${i}`,
      slug: `product-${i}`,
      name: `Featured Product ${i + 1}`,
      description: 'A comprehensive guide to mastering modern development.',
      price: 29.99 + i * 10,
      images: [`https://placehold.co/400x250?text=Product+${i + 1}`],
      seller: { id: `store-${i}`, name: 'Acme Digital Store' },
    }));
  }

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Master New Skills with{' '}
            <span className="text-primary">Digital Products</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Discover premium courses, templates, and digital assets from top creators.
            Learn at your pace, build at your speed.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/products">
                Browse Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/register/seller">Start Selling</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <Icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-primary text-sm font-medium hover:underline">
            View all <ArrowRight className="inline h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              slug={p.slug}
              name={p.name}
              description={p.description}
              price={p.price}
              image={p.images[0] ?? `https://placehold.co/400x250?text=${encodeURIComponent(p.name)}`}
              sellerName={p.seller?.name ?? 'DigiStore Seller'}
            />
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="rounded-xl bg-primary/10 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of creators monetizing their expertise. Set up your store in minutes.
          </p>
          <Button asChild size="lg">
            <Link href="/auth/register/seller">Create Your Store</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
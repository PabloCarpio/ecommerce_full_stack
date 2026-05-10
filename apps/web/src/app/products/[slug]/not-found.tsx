import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The product you are looking for does not exist or has been removed.
      </p>
      <Link
        href="/products"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Browse Products
      </Link>
    </div>
  );
}
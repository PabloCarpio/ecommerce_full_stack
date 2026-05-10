import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sellerName: string;
}

export function ProductCard({ id, slug, name, description, price, image, sellerName }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold">${price.toFixed(2)}</span>
          <Link href={`/products/${slug}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-2">by {sellerName}</p>
      </CardContent>
    </Card>
  );
}

import { Injectable, Inject } from '@nestjs/common';
import { prisma, Prisma } from '@ecommerce/database';
import { CACHE_SERVICE } from '../../common/cache/cache-token';
import type { ICacheService } from '../../common/cache/cache.interface';
import { SearchResultDto } from './dto/search-result.dto';

const SEARCH_TTL = 30_000;
const SEARCH_PREFIX = 'search:';

@Injectable()
export class SearchService {
  constructor(@Inject(CACHE_SERVICE) private readonly cache: ICacheService) {}

  async search(query: string, page: number, limit: number): Promise<SearchResultDto> {
    const cacheKey = `${SEARCH_PREFIX}${query}:${page}:${limit}`;
    const cached = await this.cache.get<SearchResultDto>(cacheKey);
    if (cached) return cached;

    const offset = (page - 1) * limit;
    const searchTerm = query.trim();

    const items = await prisma.$queryRaw<
      Array<{
        id: string;
        slug: string;
        name: string;
        description: string;
        price: Prisma.Decimal;
        images: string[];
      }>
    >`
      SELECT id, slug, name, description, price, images
      FROM "products"
      WHERE "is_published" = true
        AND to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY ts_rank(
        to_tsvector('english', name || ' ' || COALESCE(description, '')),
        plainto_tsquery('english', ${searchTerm})
      ) DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "products"
      WHERE "is_published" = true
        AND to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', ${searchTerm})
    `;

    const total = Number(countResult[0].count);

    const result: SearchResultDto = {
      items: items.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price.toNumber(),
        image: p.images[0] ?? '',
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    await this.cache.set(cacheKey, result, SEARCH_TTL);
    return result;
  }
}
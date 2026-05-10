import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Prisma, prisma } from '@ecommerce/database';
import { CACHE_SERVICE } from '../../common/cache/cache-token';
import type { ICacheService } from '../../common/cache/cache.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';

const PRODUCT_TTL = 60_000;
const PRODUCT_DETAIL_TTL = 120_000;
const PRODUCT_LIST_PREFIX = 'products:list:';
const PRODUCT_DETAIL_PREFIX = 'products:detail:';

function toProductResponse(product: {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: Prisma.Decimal;
  sellerId: string;
  categoryId: string;
  fileUrl: string | null;
  images: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: { id: string; name: string; slug: string } | null;
  seller?: { id: string; name: string } | null;
}): ProductResponseDto {
  return {
    ...product,
    price: product.price.toNumber(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: product.category ?? undefined,
    seller: product.seller ?? undefined,
  };
}

@Injectable()
export class ProductsService {
  constructor(@Inject(CACHE_SERVICE) private readonly cache: ICacheService) {}

  async findAll(query: ProductQueryDto): Promise<PaginatedProductsDto> {
    const cacheKey = `${PRODUCT_LIST_PREFIX}${JSON.stringify(query)}`;
    const cached = await this.cache.get<PaginatedProductsDto>(cacheKey);
    if (cached) return cached;

    const where: Prisma.ProductWhereInput = { isPublished: true };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = new Prisma.Decimal(query.minPrice);
      if (query.maxPrice !== undefined) where.price.lte = new Prisma.Decimal(query.maxPrice);
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      query.sortBy === 'price' ? { price: query.sortOrder } : { createdAt: query.sortOrder };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          seller: { select: { id: true, name: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const result: PaginatedProductsDto = {
      items: items.map(toProductResponse),
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };

    await this.cache.set(cacheKey, result, PRODUCT_TTL);
    return result;
  }

  async findOne(slug: string): Promise<ProductResponseDto> {
    const cacheKey = `${PRODUCT_DETAIL_PREFIX}${slug}`;
    const cached = await this.cache.get<ProductResponseDto>(cacheKey);
    if (cached) return cached;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    const response = toProductResponse(product);
    await this.cache.set(cacheKey, response, PRODUCT_DETAIL_TTL);
    return response;
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await prisma.product.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description,
        price: new Prisma.Decimal(dto.price),
        sellerId: dto.sellerId,
        categoryId: dto.categoryId,
        fileUrl: dto.fileUrl ?? null,
        images: dto.images ?? [],
        isPublished: dto.isPublished ?? false,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    await this.invalidateAll();
    return toProductResponse(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const data: Prisma.ProductUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.price !== undefined) data.price = new Prisma.Decimal(dto.price);
    if (dto.fileUrl !== undefined) data.fileUrl = dto.fileUrl;
    if (dto.images !== undefined) data.images = dto.images;
    if (dto.isPublished !== undefined) data.isPublished = dto.isPublished;
    if (dto.categoryId !== undefined) data.category = { connect: { id: dto.categoryId } };

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    await this.invalidateAll();
    return toProductResponse(product);
  }

  async remove(id: string): Promise<void> {
    const product = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
    await prisma.product.delete({ where: { id } });
    await this.invalidateAll();
    if (product) {
      await this.cache.del(`${PRODUCT_DETAIL_PREFIX}${product.slug}`);
    }
  }

  private async invalidateAll(): Promise<void> {
    await this.cache.delByPattern(`${PRODUCT_LIST_PREFIX}*`);
    await this.cache.delByPattern(`${PRODUCT_DETAIL_PREFIX}*`);
  }
}
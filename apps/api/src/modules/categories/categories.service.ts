import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { prisma } from '@ecommerce/database';
import { CACHE_SERVICE } from '../../common/cache/cache-token';
import type { ICacheService } from '../../common/cache/cache.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto, CategoryTreeNodeDto } from './dto/category-response.dto';

const CATEGORY_TTL = 300_000;
const CATEGORY_TREE_TTL = 300_000;
const CATEGORY_LIST_KEY = 'categories:list';
const CATEGORY_TREE_KEY = 'categories:tree';
const CATEGORY_DETAIL_PREFIX = 'categories:detail:';

@Injectable()
export class CategoriesService {
  constructor(@Inject(CACHE_SERVICE) private readonly cache: ICacheService) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const cached = await this.cache.get<CategoryResponseDto[]>(CATEGORY_LIST_KEY);
    if (cached) return cached;

    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });

    const result = categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      parentId: c.parentId,
      productCount: c._count.products,
    }));

    await this.cache.set(CATEGORY_LIST_KEY, result, CATEGORY_TTL);
    return result;
  }

  async getTree(): Promise<CategoryTreeNodeDto[]> {
    const cached = await this.cache.get<CategoryTreeNodeDto[]>(CATEGORY_TREE_KEY);
    if (cached) return cached;

    const categories = await prisma.category.findMany();
    const map = new Map<string, CategoryTreeNodeDto>();

    for (const cat of categories) {
      map.set(cat.id, {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        parentId: cat.parentId,
        children: [],
      });
    }

    const roots: CategoryTreeNodeDto[] = [];
    for (const node of map.values()) {
      if (node.parentId) {
        const parent = map.get(node.parentId);
        if (parent) parent.children.push(node);
      } else {
        roots.push(node);
      }
    }

    await this.cache.set(CATEGORY_TREE_KEY, roots, CATEGORY_TREE_TTL);
    return roots;
  }

  async findOne(slug: string): Promise<CategoryResponseDto> {
    const cacheKey = `${CATEGORY_DETAIL_PREFIX}${slug}`;
    const cached = await this.cache.get<CategoryResponseDto>(cacheKey);
    if (cached) return cached;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isPublished: true },
          select: { id: true, slug: true, name: true, price: true, images: true },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    const result: CategoryResponseDto = {
      id: category.id,
      slug: category.slug,
      name: category.name,
      parentId: category.parentId,
      productCount: category._count.products,
      products: category.products.map((p) => ({
        ...p,
        price: p.price.toNumber(),
      })),
    };

    await this.cache.set(cacheKey, result, CATEGORY_TTL);
    return result;
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const category = await prisma.category.create({
      data: { slug: dto.slug, name: dto.name, parentId: dto.parentId ?? null },
      include: { _count: { select: { products: true } } },
    });
    await this.invalidateAll();
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      parentId: category.parentId,
      productCount: category._count.products,
    };
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.name && { name: dto.name }),
        ...(dto.parentId !== undefined && { parentId: dto.parentId }),
      },
      include: { _count: { select: { products: true } } },
    });
    await this.invalidateAll();
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      parentId: category.parentId,
      productCount: category._count.products,
    };
  }

  async remove(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
    await this.invalidateAll();
  }

  private async invalidateAll(): Promise<void> {
    await this.cache.del(CATEGORY_LIST_KEY);
    await this.cache.del(CATEGORY_TREE_KEY);
    await this.cache.delByPattern(`${CATEGORY_DETAIL_PREFIX}*`);
  }
}
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CACHE_SERVICE } from '../../common/cache/cache-token';

jest.mock('@ecommerce/database', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
  Prisma: { Decimal: class Decimal { constructor(v: any) { return v as any; } } },
}));

import { prisma } from '@ecommerce/database';

const mockPrisma = prisma as unknown as {
  product: {
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: CACHE_SERVICE, useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn(), delByPattern: jest.fn() } },
        { provide: 'CACHE_MANAGER', useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn(), store: { keys: jest.fn() } } },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      const result = await service.findAll({
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'desc' as any,
      });

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('totalPages');
    });
  });

  describe('findOne', () => {
    it('should return a product by slug', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        slug: 'test-product',
        name: 'Test',
        description: 'Desc',
        price: { toNumber: () => 10 },
        sellerId: 'store-1',
        categoryId: 'cat-1',
        fileUrl: null,
        images: [],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: null,
        seller: null,
      });

      const result = await service.findOne('test-product');
      expect(result.slug).toBe('test-product');
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });
});

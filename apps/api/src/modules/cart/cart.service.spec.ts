import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';

jest.mock('@ecommerce/database', () => ({
  prisma: {
    cart: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  },
  Prisma: { Decimal: class Decimal { constructor(v: number) { return v as any; } } },
}));

import { prisma } from '@ecommerce/database';

const mockPrisma = prisma as unknown as {
  cart: {
    findUnique: jest.Mock;
    upsert: jest.Mock;
    delete: jest.Mock;
  };
  cartItem: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    deleteMany: jest.Mock;
  };
  product: {
    findUnique: jest.Mock;
  };
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: 'CACHE_MANAGER', useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() } },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return empty cart if no cart exists', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue(null);

      const result = await service.getCart('user-1');
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('addItem', () => {
    it('should add item to authenticated user cart', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        name: 'Test',
        slug: 'test',
        price: { toNumber: () => 10 },
        images: [],
        isPublished: true,
      });
      mockPrisma.cart.upsert.mockResolvedValue({ id: 'cart-1', userId: 'user-1' });
      mockPrisma.cartItem.findUnique.mockResolvedValue(null);
      mockPrisma.cartItem.create.mockResolvedValue({});
      mockPrisma.cart.findUnique.mockResolvedValue({ items: [] });

      const result = await service.addItem(
        { productId: 'prod-1', quantity: 1 },
        'user-1',
      );

      expect(result).toHaveProperty('items');
      expect(mockPrisma.cartItem.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException without userId or guestId', async () => {
      await expect(
        service.addItem({ productId: 'prod-1', quantity: 1 }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

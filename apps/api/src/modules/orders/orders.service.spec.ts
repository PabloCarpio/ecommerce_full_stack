import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MAIL_SERVICE } from '../mail/mail.token';

jest.mock('@ecommerce/database', () => ({
  prisma: {
    cart: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    orderItem: {
      createMany: jest.fn(),
    },
    access: {
      createMany: jest.fn(),
    },
    cartItem: {
      deleteMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(prisma)),
  },
  Prisma: { Decimal: class Decimal { constructor(v) { return v as any; } } },
  OrderStatus: { PENDING: 'PENDING', PAID: 'PAID' },
}));

import { prisma, OrderStatus } from '@ecommerce/database';

const mockPrisma = prisma as unknown as {
  cart: { findUnique: jest.Mock };
  order: { create: jest.Mock; findUnique: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock; update: jest.Mock };
  orderItem: { createMany: jest.Mock };
  access: { createMany: jest.Mock };
  cartItem: { deleteMany: jest.Mock };
  user: { findUnique: jest.Mock };
  $transaction: jest.Mock;
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: MAIL_SERVICE, useValue: { sendMail: jest.fn(), sendWelcome: jest.fn(), sendOrderConfirmation: jest.fn() } },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order from cart', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            product: {
              id: 'prod-1',
              name: 'Test',
              slug: 'test',
              price: { toNumber: () => 10 },
              images: [],
              isPublished: true,
            },
            quantity: 2,
          },
        ],
      });
      mockPrisma.$transaction.mockImplementation(async (cb) => {
        mockPrisma.order.create.mockResolvedValue({ id: 'order-1' });
        return cb(mockPrisma);
      });
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.PENDING,
        total: { toNumber: () => 20 },
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 'item-1',
            quantity: 2,
            unitPrice: { toNumber: () => 10 },
            product: { id: 'prod-1', name: 'Test', slug: 'test', images: [] },
          },
        ],
      });

      const result = await service.create('user-1', { status: OrderStatus.PENDING });

      expect(result).toHaveProperty('id');
      expect(result.items).toHaveLength(1);
    });

    it('should throw BadRequestException if cart is empty', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ items: [] });

      await expect(service.create('user-1', { status: OrderStatus.PENDING })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException for missing order', async () => {
      mockPrisma.order.findFirst.mockResolvedValue(null);

      await expect(service.findOne('missing', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });
});

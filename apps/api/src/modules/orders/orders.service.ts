import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma, Prisma, OrderStatus } from '@ecommerce/database';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

function toOrderResponse(order: {
  id: string;
  status: OrderStatus;
  total: Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: Prisma.Decimal;
    product: { id: string; name: string; slug: string; images: string[] };
  }>;
}): OrderResponseDto {
  return {
    id: order.id,
    status: order.status,
    total: order.total.toNumber(),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toNumber(),
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        image: item.product.images[0] ?? '',
      },
    })),
  };
}

@Injectable()
export class OrdersService {
  async create(userId: string, _dto: CreateOrderDto): Promise<OrderResponseDto> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, price: true, images: true, isPublished: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const invalidItems = cart.items.filter((item) => !item.product.isPublished);
    if (invalidItems.length > 0) {
      throw new BadRequestException(`Product(s) no longer available: ${invalidItems.map((i) => i.product.name).join(', ')}`);
    }

    const total = cart.items.reduce((sum, item) => sum + item.product.price.toNumber() * item.quantity, 0);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          total: new Prisma.Decimal(total),
        },
      });

      await tx.orderItem.createMany({
        data: cart.items.map((item) => ({
          orderId: created.id,
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
      });

      await tx.access.createMany({
        data: cart.items.map((item) => ({
          userId,
          productId: item.product.id,
        })),
        skipDuplicates: true,
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.delete({ where: { id: cart.id } });

      return created;
    });

    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, images: true } },
          },
        },
      },
    });

    if (!fullOrder) {
      throw new NotFoundException('Order not found after creation');
    }

    return toOrderResponse(fullOrder);
  }

  async findAll(userId: string): Promise<OrderResponseDto[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, images: true } },
          },
        },
      },
    });

    return orders.map(toOrderResponse);
  }

  async findOne(id: string, userId: string): Promise<OrderResponseDto> {
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, images: true } },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return toOrderResponse(order);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderResponseDto> {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, images: true } },
          },
        },
      },
    });

    return toOrderResponse(order);
  }
}

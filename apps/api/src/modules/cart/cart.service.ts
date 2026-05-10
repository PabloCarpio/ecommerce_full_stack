import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { prisma, Prisma } from '@ecommerce/database';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';

interface GuestCartItem {
  productId: string;
  quantity: number;
}

function guestCacheKey(guestId: string): string {
  return `cart:guest:${guestId}`;
}

async function getProduct(productId: string): Promise<{
  id: string;
  name: string;
  slug: string;
  price: Prisma.Decimal;
  images: string[];
  isPublished: boolean;
}> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, slug: true, price: true, images: true, isPublished: true },
  });
  if (!product) {
    throw new NotFoundException('Product not found');
  }
  if (!product.isPublished) {
    throw new BadRequestException('Product is not available');
  }
  return product;
}

function toCartResponse(
  items: Array<{ id: string; quantity: number; product: { id: string; name: string; slug: string; price: Prisma.Decimal; images: string[] } }>,
): CartResponseDto {
  const total = items.reduce((sum, item) => sum + item.product.price.toNumber() * item.quantity, 0);
  return {
    items: items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price.toNumber(),
        image: item.product.images[0] ?? '',
      },
    })),
    total: Math.round(total * 100) / 100,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

@Injectable()
export class CartService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCart(userId?: string, guestId?: string): Promise<CartResponseDto> {
    if (userId) {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, slug: true, price: true, images: true } },
            },
          },
        },
      });
      return toCartResponse(cart?.items ?? []);
    }

    if (!guestId) {
      throw new BadRequestException('guestId or authentication required');
    }

    const cached = await this.cacheManager.get<GuestCartItem[]>(guestCacheKey(guestId));
    const items = cached ?? [];
    const enriched = await Promise.all(
      items.map(async (item) => {
        const product = await getProduct(item.productId);
        return {
          id: `guest-${item.productId}`,
          quantity: item.quantity,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            images: product.images,
          },
        };
      }),
    );
    return toCartResponse(enriched);
  }

  async addItem(dto: AddCartItemDto, userId?: string, guestId?: string): Promise<CartResponseDto> {
    await getProduct(dto.productId);

    if (userId) {
      const cart = await prisma.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
      });

      const existing = await prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId: dto.productId } },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + dto.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: { cartId: cart.id, productId: dto.productId, quantity: dto.quantity },
        });
      }

      return this.getCart(userId);
    }

    if (!guestId) {
      throw new BadRequestException('guestId or authentication required');
    }

    const key = guestCacheKey(guestId);
    const items = (await this.cacheManager.get<GuestCartItem[]>(key)) ?? [];
    const idx = items.findIndex((i) => i.productId === dto.productId);
    if (idx >= 0) {
      items[idx].quantity += dto.quantity;
    } else {
      items.push({ productId: dto.productId, quantity: dto.quantity });
    }
    await this.cacheManager.set(key, items, 259200000); // 3 days TTL

    return this.getCart(undefined, guestId);
  }

  async updateItem(itemId: string, quantity: number, userId: string): Promise<CartResponseDto> {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await prisma.cartItem.update({
      where: { id: itemId, cartId: cart.id },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(itemId: string, userId: string): Promise<void> {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await prisma.cartItem.delete({
      where: { id: itemId, cartId: cart.id },
    });
  }

  async mergeGuestCart(guestId: string, userId: string): Promise<CartResponseDto> {
    const key = guestCacheKey(guestId);
    const guestItems = await this.cacheManager.get<GuestCartItem[]>(key);

    if (!guestItems || guestItems.length === 0) {
      return this.getCart(userId);
    }

    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    for (const item of guestItems) {
      const existing = await prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId: item.productId } },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: { cartId: cart.id, productId: item.productId, quantity: item.quantity },
        });
      }
    }

    await this.cacheManager.del(key);
    return this.getCart(userId);
  }
}

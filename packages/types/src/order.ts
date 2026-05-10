import { z } from 'zod';

export const OrderStatus = z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']);
export type OrderStatus = z.infer<typeof OrderStatus>;

export const CartItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const CartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  items: z.array(CartItemSchema),
});
export type Cart = z.infer<typeof CartSchema>;

export const OrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: OrderStatus,
  total: z.number().positive(),
  paymentIntentId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Order = z.infer<typeof OrderSchema>;

export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  sellerId: z.string().uuid(),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const AccessSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  grantedAt: z.date(),
});
export type Access = z.infer<typeof AccessSchema>;
import { z } from 'zod';

export const ProductStatus = z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']);
export type ProductStatus = z.infer<typeof ProductStatus>;

export const ProductSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  sellerId: z.string().uuid(),
  categoryId: z.string().uuid(),
  fileUrl: z.string().url().optional(),
  images: z.array(z.string().url()),
  status: ProductStatus,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string(),
  price: z.number().positive().multipleOf(0.01),
  categoryId: z.string().uuid(),
  fileUrl: z.string().url().optional(),
  images: z.array(z.string().url()).min(1),
});
export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export const CategorySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string().min(1),
  parentId: z.string().uuid().optional(),
});
export type Category = z.infer<typeof CategorySchema>;

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  body: z.string(),
  createdAt: z.date(),
});
export type Review = z.infer<typeof ReviewSchema>;
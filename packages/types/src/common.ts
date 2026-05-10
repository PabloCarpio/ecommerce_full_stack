import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const CursorPaginationSchema = PaginationSchema.extend({
  cursor: z.string().optional(),
});
export type CursorPagination = z.infer<typeof CursorPaginationSchema>;

export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string().optional(),
  timestamp: z.string(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export const IdParamSchema = z.object({
  id: z.string().uuid(),
});
export type IdParam = z.infer<typeof IdParamSchema>;

export const SlugParamSchema = z.object({
  slug: z.string().min(1),
});
export type SlugParam = z.infer<typeof SlugParamSchema>;

export const ApiResponseSchema = <T extends z.ZodType>(data: T) =>
  z.object({
    data,
    pagination: PaginationSchema.optional(),
  });
export type ApiResponse<T> = {
  data: T;
  pagination?: Pagination;
};
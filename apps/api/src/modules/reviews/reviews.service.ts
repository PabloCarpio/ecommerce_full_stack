import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { prisma, Prisma, Role } from '@ecommerce/database';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { PaginatedReviewsDto } from './dto/paginated-reviews.dto';

function toReviewResponse(review: {
  id: string;
  rating: number;
  body: string | null;
  createdAt: Date;
  user: { id: string; email: string };
}): ReviewResponseDto {
  return {
    id: review.id,
    rating: review.rating,
    body: review.body,
    createdAt: review.createdAt.toISOString(),
    user: {
      id: review.user.id,
      email: review.user.email,
    },
  };
}

@Injectable()
export class ReviewsService {
  async findByProductSlug(slug: string, page: number, limit: number): Promise<PaginatedReviewsDto> {
    const product = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId: product.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, email: true } } },
      }),
      prisma.review.count({ where: { productId: product.id } }),
    ]);

    return {
      items: items.map(toReviewResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(slug: string, userId: string, dto: CreateReviewDto): Promise<ReviewResponseDto> {
    const product = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId: product.id } },
    });
    if (existing) {
      throw new ConflictException('You have already reviewed this product');
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId: product.id,
        rating: dto.rating,
        body: dto.body ?? null,
      },
      include: { user: { select: { id: true, email: true } } },
    });

    return toReviewResponse(review);
  }

  async remove(id: string, userId: string, userRole: Role): Promise<void> {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await prisma.review.delete({ where: { id } });
  }
}

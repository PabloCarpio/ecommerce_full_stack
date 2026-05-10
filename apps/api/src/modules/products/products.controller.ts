import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@ecommerce/database';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ProductsService } from './products.service';
import { ReviewsService } from '../reviews/reviews.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { PaginatedReviewsDto } from '../reviews/dto/paginated-reviews.dto';
import { ReviewResponseDto } from '../reviews/dto/review-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List & search products (cached)' })
  @ApiResponse({ status: 200, description: 'Paginated product list', type: PaginatedProductsDto })
  async findAll(@Query() query: ProductQueryDto): Promise<PaginatedProductsDto> {
    return this.productsService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single product by slug' })
  @ApiResponse({ status: 200, description: 'Product found', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('slug') slug: string): Promise<ProductResponseDto> {
    return this.productsService.findOne(slug);
  }

  @Get(':slug/reviews')
  @ApiOperation({ summary: 'Get product reviews' })
  @ApiResponse({ status: 200, description: 'Paginated reviews', type: PaginatedReviewsDto })
  async getReviews(
    @Param('slug') slug: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<PaginatedReviewsDto> {
    return this.reviewsService.findByProductSlug(slug, Number(page), Number(limit));
  }

  @Post(':slug/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Post a review (one per product)' })
  @ApiResponse({ status: 201, description: 'Review created', type: ReviewResponseDto })
  @ApiResponse({ status: 409, description: 'Already reviewed this product' })
  async createReview(
    @Param('slug') slug: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: { userId: string },
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.create(slug, user.userId, dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Product created', type: ProductResponseDto })
  async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Product updated', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<ProductResponseDto> {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product (ADMIN only)' })
  @ApiResponse({ status: 204, description: 'Product deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}

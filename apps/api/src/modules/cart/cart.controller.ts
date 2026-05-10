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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get cart (auth or guest)' })
  @ApiQuery({ name: 'guestId', required: false, description: 'Required for unauthenticated users' })
  @ApiResponse({ status: 200, description: 'Current cart', type: CartResponseDto })
  async getCart(
    @CurrentUser() user: { userId: string } | null,
    @Query('guestId') guestId?: string,
  ): Promise<CartResponseDto> {
    return this.cartService.getCart(user?.userId ?? undefined, guestId);
  }

  @Post('items')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Add item to cart (auth or guest)' })
  @ApiQuery({ name: 'guestId', required: false })
  @ApiResponse({ status: 200, description: 'Updated cart', type: CartResponseDto })
  async addItem(
    @Body() dto: AddCartItemDto,
    @CurrentUser() user: { userId: string } | null,
    @Query('guestId') guestId?: string,
  ): Promise<CartResponseDto> {
    return this.cartService.addItem(dto, user?.userId ?? undefined, guestId);
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cart item quantity (auth only)' })
  @ApiResponse({ status: 200, description: 'Updated cart', type: CartResponseDto })
  async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
    @CurrentUser() user: { userId: string },
  ): Promise<CartResponseDto> {
    return this.cartService.updateItem(id, dto.quantity, user.userId);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove item from cart (auth only)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Item removed' })
  async removeItem(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ): Promise<void> {
    return this.cartService.removeItem(id, user.userId);
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Merge guest cart into user cart on login' })
  @ApiResponse({ status: 200, description: 'Merged cart', type: CartResponseDto })
  async mergeCart(
    @Body() dto: MergeCartDto,
    @CurrentUser() user: { userId: string },
  ): Promise<CartResponseDto> {
    return this.cartService.mergeGuestCart(dto.guestId, user.userId);
  }
}
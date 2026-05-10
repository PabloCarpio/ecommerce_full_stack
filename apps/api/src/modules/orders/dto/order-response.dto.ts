import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@ecommerce/database';

class OrderItemProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  image: string;
}

class OrderItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty({ type: OrderItemProductDto })
  product: OrderItemProductDto;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty()
  total: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];
}

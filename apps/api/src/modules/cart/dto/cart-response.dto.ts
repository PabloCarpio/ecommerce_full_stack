import { ApiProperty } from '@nestjs/swagger';

class CartItemProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  image: string;
}

class CartItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: CartItemProductDto })
  product: CartItemProductDto;
}

export class CartResponseDto {
  @ApiProperty({ type: [CartItemDto] })
  items: CartItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  itemCount: number;
}

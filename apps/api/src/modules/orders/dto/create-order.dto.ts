import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@ecommerce/database';

export class CreateOrderDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  status: OrderStatus = OrderStatus.PENDING;
}

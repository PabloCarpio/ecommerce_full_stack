import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MergeCartDto {
  @ApiProperty({ example: 'guest-cart-id-abc' })
  @IsString()
  guestId: string;
}

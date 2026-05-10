import { ApiProperty } from '@nestjs/swagger';

export class PlatformAnalyticsDto {
  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  totalTransactions: number;

  @ApiProperty()
  activeSellers: number;

  @ApiProperty()
  totalProducts: number;

  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  totalOrders: number;
}

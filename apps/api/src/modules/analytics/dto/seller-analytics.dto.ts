import { ApiProperty } from '@nestjs/swagger';

export class SellerAnalyticsDto {
  @ApiProperty()
  storeName: string;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  totalSales: number;

  @ApiProperty()
  totalProducts: number;

  @ApiProperty()
  averageOrderValue: number;
}

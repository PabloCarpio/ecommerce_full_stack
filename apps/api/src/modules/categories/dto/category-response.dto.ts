import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CategoryProductSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ type: [String] })
  images: string[];
}

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  parentId: string | null;

  @ApiPropertyOptional()
  productCount?: number;

  @ApiPropertyOptional({ type: [CategoryProductSummaryDto] })
  products?: CategoryProductSummaryDto[];
}

export class CategoryTreeNodeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  parentId: string | null;

  @ApiProperty({ type: () => [CategoryTreeNodeDto] })
  children: CategoryTreeNodeDto[];
}

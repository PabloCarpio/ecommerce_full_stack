import { ApiProperty } from '@nestjs/swagger';

class CategorySummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

class StoreSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  sellerId: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty({ nullable: true })
  fileUrl: string | null;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ type: CategorySummaryDto, required: false })
  category?: CategorySummaryDto;

  @ApiProperty({ type: StoreSummaryDto, required: false })
  seller?: StoreSummaryDto;
}

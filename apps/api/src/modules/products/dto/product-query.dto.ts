import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ProductQueryDto {
  @ApiPropertyOptional({ example: 'nextjs' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'category-id-456' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 12;

  @ApiPropertyOptional({ enum: ['createdAt', 'price'], example: 'createdAt' })
  @IsOptional()
  @IsEnum(['createdAt', 'price'])
  sortBy: 'createdAt' | 'price' = 'createdAt';

  @ApiPropertyOptional({ enum: SortOrder, example: 'desc' })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;
}

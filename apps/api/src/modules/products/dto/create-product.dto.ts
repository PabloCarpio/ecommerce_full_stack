import { IsString, IsNumber, IsOptional, IsBoolean, Min, MaxLength, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'nextjs-masterclass' })
  @IsString()
  @Length(1, 128)
  slug: string;

  @ApiProperty({ example: 'Next.js 15 Masterclass' })
  @IsString()
  @Length(1, 256)
  name: string;

  @ApiProperty({ example: 'Build production-ready apps...' })
  @IsString()
  @Length(1, 5000)
  description: string;

  @ApiProperty({ example: 49.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'store-id-123' })
  @IsString()
  sellerId: string;

  @ApiProperty({ example: 'category-id-456' })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/file.zip' })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({ example: ['https://cdn.example.com/img1.jpg'] })
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

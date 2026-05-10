import { IsString, IsNumber, IsOptional, IsBoolean, Min, MaxLength, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'nextjs-masterclass-v2' })
  @IsOptional()
  @IsString()
  @Length(1, 128)
  slug?: string;

  @ApiPropertyOptional({ example: 'Next.js 15 Masterclass v2' })
  @IsOptional()
  @IsString()
  @Length(1, 256)
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description...' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({ example: 59.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 'category-id-456' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/file.zip' })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({ example: ['https://cdn.example.com/img1.jpg'] })
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

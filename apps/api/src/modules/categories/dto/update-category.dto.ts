import { IsString, IsOptional, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'web-dev' })
  @IsOptional()
  @IsString()
  @Length(1, 128)
  slug?: string;

  @ApiPropertyOptional({ example: 'Web Dev' })
  @IsOptional()
  @IsString()
  @Length(1, 128)
  name?: string;

  @ApiPropertyOptional({ example: 'parent-category-id' })
  @IsOptional()
  @IsString()
  parentId?: string;
}

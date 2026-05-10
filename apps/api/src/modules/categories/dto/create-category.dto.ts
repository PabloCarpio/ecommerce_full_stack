import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'web-development' })
  @IsString()
  @Length(1, 128)
  slug: string;

  @ApiProperty({ example: 'Web Development' })
  @IsString()
  @Length(1, 128)
  name: string;

  @ApiPropertyOptional({ example: 'parent-category-id' })
  @IsOptional()
  @IsString()
  parentId?: string;
}

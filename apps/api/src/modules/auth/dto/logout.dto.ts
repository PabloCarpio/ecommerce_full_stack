import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogoutDto {
  @ApiPropertyOptional({ description: 'Refresh token to revoke' })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
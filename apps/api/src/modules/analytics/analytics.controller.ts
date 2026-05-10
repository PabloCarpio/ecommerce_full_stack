import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@ecommerce/database';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AnalyticsService } from './analytics.service';
import { SellerAnalyticsDto } from './dto/seller-analytics.dto';
import { PlatformAnalyticsDto } from './dto/platform-analytics.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('seller')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seller analytics (revenue, sales, products)' })
  @ApiResponse({ status: 200, description: 'Seller KPIs', type: SellerAnalyticsDto })
  async getSellerAnalytics(
    @CurrentUser() user: { userId: string },
  ): Promise<SellerAnalyticsDto> {
    return this.analyticsService.getSellerAnalytics(user.userId);
  }

  @Get('platform')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Platform-wide analytics (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Platform KPIs', type: PlatformAnalyticsDto })
  async getPlatformAnalytics(): Promise<PlatformAnalyticsDto> {
    return this.analyticsService.getPlatformAnalytics();
  }
}

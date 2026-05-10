import { Injectable } from '@nestjs/common';
import { prisma, Prisma } from '@ecommerce/database';
import { SellerAnalyticsDto } from './dto/seller-analytics.dto';
import { PlatformAnalyticsDto } from './dto/platform-analytics.dto';

@Injectable()
export class AnalyticsService {
  async getSellerAnalytics(userId: string): Promise<SellerAnalyticsDto> {
    const store = await prisma.store.findUnique({
      where: { sellerId: userId },
      select: { id: true, name: true },
    });

    if (!store) {
      return {
        storeName: '',
        totalRevenue: 0,
        totalSales: 0,
        totalProducts: 0,
        averageOrderValue: 0,
      };
    }

    const [productsCount, orderItems] = await Promise.all([
      prisma.product.count({ where: { sellerId: store.id } }),
      prisma.orderItem.findMany({
        where: { product: { sellerId: store.id } },
        select: { quantity: true, unitPrice: true },
      }),
    ]);

    const totalRevenue = orderItems.reduce(
      (sum, item) => sum + item.unitPrice.toNumber() * item.quantity,
      0,
    );
    const totalSales = orderItems.length;
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    return {
      storeName: store.name,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalSales,
      totalProducts: productsCount,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    };
  }

  async getPlatformAnalytics(): Promise<PlatformAnalyticsDto> {
    const [
      totalRevenueResult,
      totalTransactions,
      activeSellers,
      totalProducts,
      totalUsers,
      totalOrders,
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.orderItem.count(),
      prisma.store.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count(),
    ]);

    return {
      totalRevenue: totalRevenueResult._sum.total?.toNumber() ?? 0,
      totalTransactions,
      activeSellers,
      totalProducts,
      totalUsers,
      totalOrders,
    };
  }
}

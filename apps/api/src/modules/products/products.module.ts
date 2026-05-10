import { Module } from '@nestjs/common';
import { ReviewsModule } from '../reviews/reviews.module';
import { InMemoryCacheService } from '../../common/cache/in-memory-cache.service';
import { CACHE_SERVICE } from '../../common/cache/cache-token';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [ReviewsModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    InMemoryCacheService,
    { provide: CACHE_SERVICE, useExisting: InMemoryCacheService },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
import { Module } from '@nestjs/common';
import { InMemoryCacheService } from '../../common/cache/in-memory-cache.service';
import { CACHE_SERVICE } from '../../common/cache/cache-token';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    InMemoryCacheService,
    { provide: CACHE_SERVICE, useExisting: InMemoryCacheService },
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
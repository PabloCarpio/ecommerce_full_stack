import { Module } from '@nestjs/common';
import { InMemoryCacheService } from '../../common/cache/in-memory-cache.service';
import { CACHE_SERVICE } from '../../common/cache/cache-token';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    InMemoryCacheService,
    { provide: CACHE_SERVICE, useExisting: InMemoryCacheService },
  ],
})
export class SearchModule {}
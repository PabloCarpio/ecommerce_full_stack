import { Module, Global } from '@nestjs/common';
import { CACHE_SERVICE } from './cache-token';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
  providers: [
    RedisCacheService,
    { provide: CACHE_SERVICE, useExisting: RedisCacheService },
  ],
  exports: [CACHE_SERVICE],
})
export class CacheModule {}

import { Module, Global } from '@nestjs/common';
import { CACHE_SERVICE } from './cache-token';
import { RedisCacheService } from './redis-cache.service';
import { InMemoryCacheService } from './in-memory-cache.service';

const useRedis = Boolean(process.env.UPSTASH_REDIS_REST_URL);

@Global()
@Module({
  providers: [
    useRedis ? RedisCacheService : InMemoryCacheService,
    { provide: CACHE_SERVICE, useExisting: useRedis ? RedisCacheService : InMemoryCacheService },
  ],
  exports: [CACHE_SERVICE],
})
export class CacheModule {}

import { DynamicModule, Module, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisOptions } from 'ioredis/built/redis/RedisOptions';

interface RedisModuleOption {
  global: boolean;
  redisConfig: RedisOptions;
}

@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOption): DynamicModule {
    const redis = new Redis(options.redisConfig);
    const redisProvider: Provider = {
      provide: Redis,
      useFactory() {
        return redis;
      },
    };

    return {
      module: RedisModule,
      global: options.global,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}

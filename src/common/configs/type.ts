import { RedisOptions } from 'ioredis/built/redis/RedisOptions';
import { DataSourceOptions } from 'typeorm';

export interface GlobalConfigType extends GlobalEnvConfigType {}

export interface GlobalEnvConfigType {
  // redis配置
  redisConfig: RedisOptions;
  // 数据库配置
  ormConfig: DataSourceOptions;
}

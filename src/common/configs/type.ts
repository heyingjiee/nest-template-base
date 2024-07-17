import { RedisOptions } from 'ioredis/built/redis/RedisOptions';
import { DataSourceOptions } from 'typeorm';

export interface GlobalConfigType extends GlobalEnvConfigType {}

export interface GlobalEnvConfigType {
  // 项目根路径
  rootDir: string;
  // 项目资源路径
  sourceDir: string;
  // 日志路径
  logDir: string;
  // 静态资源路径
  staticAssetDir: string;
  // 项目名
  applicationName: string;
  // redis配置
  redisConfig: RedisOptions;
  // 数据库配置
  ormConfig: DataSourceOptions;
}

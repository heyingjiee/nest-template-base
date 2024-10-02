import { RedisOptions } from 'ioredis/built/redis/RedisOptions';
import { DataSourceOptions } from 'typeorm';

export interface JWTOption {
  secret: string;
  expire: string;
}

export interface GlobalConfigType extends GlobalEnvConfigType {
  // 项目根路径
  rootDir: string;
  // 项目资源路径
  sourceDir: string;
  // 日志路径
  logDir: string;
  // 上传文件目录
  uploadDir: string;
  // 静态资源路径
  staticAssetDir: string;
  // 项目名
  applicationName: string;
}

export interface GlobalEnvConfigType {
  // 启动端口
  port: number;
  // redis配置
  redisConfig: RedisOptions;
  // 数据库配置
  ormConfig: DataSourceOptions;
  JWTConfig: JWTOption;
}

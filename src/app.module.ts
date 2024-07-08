import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './common/configs/db.config';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './common/modules/redis.module';
import { redisConfig } from './common/configs/redis.config';
import { LoginGuard } from './user/login.guard';
import { PermissionGuard } from './user/permission.guard';
import { LoggerModule } from './common/modules/logger.module';
import { ExceptionFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(ormConfig),
    RedisModule.forRoot({
      global: true,
      redisConfig,
    }),
    LoggerModule.forRoot({ global: true }),
    JwtModule.register({
      global: true, // 设置为全局模块，使用无需import，全局都可以注入
      secret: 'hedaodao', // 秘钥
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 路由守卫
    {
      provide: 'APP_GUARD',
      useClass: LoginGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: PermissionGuard,
    },
    // 错误拦截
    {
      provide: 'APP_FILTER',
      useClass: ExceptionFilter,
    },
    // 拦截器
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
